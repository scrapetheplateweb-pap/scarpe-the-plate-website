const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const PATCHES_FILE = path.join(__dirname, "../data/patches.json");
const BACKUPS_DIR = path.join(__dirname, "../data/backups");
const PROJECT_ROOT = path.join(__dirname, "../..");

fs.mkdirSync(path.dirname(PATCHES_FILE), { recursive: true });
fs.mkdirSync(BACKUPS_DIR, { recursive: true });

if (!fs.existsSync(PATCHES_FILE)) {
  fs.writeFileSync(PATCHES_FILE, JSON.stringify([], null, 2));
}

function loadPatches() {
  try {
    return JSON.parse(fs.readFileSync(PATCHES_FILE, "utf8"));
  } catch {
    return [];
  }
}

function savePatches(patches) {
  fs.writeFileSync(PATCHES_FILE, JSON.stringify(patches, null, 2));
}

function sanitizeError(error, filePath) {
  let message = error.message || String(error);
  
  message = message.replace(new RegExp(PROJECT_ROOT, 'g'), '[PROJECT]');
  message = message.replace(/\/home\/[^\/]+\/[^\s]+/g, '[PATH]');
  message = message.replace(/[A-Z]:\\[^\s]+/g, '[PATH]');
  
  if (message.includes('EISDIR')) {
    return `Cannot perform operation: path is a directory`;
  }
  if (message.includes('ENOENT')) {
    return `File not found: ${filePath || 'unknown'}`;
  }
  if (message.includes('EACCES') || message.includes('EPERM')) {
    return `Permission denied`;
  }
  
  return message;
}

function validatePath(filePath) {
  const resolved = path.resolve(PROJECT_ROOT, filePath);
  const relative = path.relative(PROJECT_ROOT, resolved);
  
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error("Path traversal detected - access outside project root not allowed");
  }
  
  if (relative.includes('..')) {
    throw new Error("Path contains parent directory references");
  }
  
  const forbidden = ['node_modules', '.git', path.join('backend', 'data')];
  for (const dir of forbidden) {
    if (relative.startsWith(dir) || relative.includes(path.sep + dir + path.sep)) {
      throw new Error(`Cannot modify protected directory: ${dir}`);
    }
  }
  
  return resolved;
}

function validateBackupPath(backupPath) {
  const resolved = path.resolve(backupPath);
  const relative = path.relative(BACKUPS_DIR, resolved);
  
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error("Invalid backup path - must be inside backups directory");
  }
  
  if (!fs.existsSync(resolved)) {
    throw new Error("Backup file does not exist");
  }
  
  return resolved;
}

function createBackup(filePath) {
  const timestamp = Date.now();
  const basename = path.basename(filePath);
  const backupName = `${basename}_${timestamp}`;
  const backupPath = path.join(BACKUPS_DIR, backupName);
  
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  }
  return null;
}

router.post("/patch/apply", async (req, res) => {
  try {
    let { name, description, operations } = req.body;
    
    if (!name || !operations || !Array.isArray(operations)) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid patch format. Required: name, description, operations[]" 
      });
    }
    
    if (operations.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Too many operations (max 50)" 
      });
    }
    
    const patch = {
      id: Date.now().toString(),
      name: String(name).substring(0, 200),
      description: String(description || "").substring(0, 500),
      timestamp: new Date().toISOString(),
      operations: [],
      backups: [],
      status: "applying"
    };
    
    const results = [];
    const appliedOps = [];
    
    for (const op of operations) {
      let opSuccess = false;
      let opError = null;
      
      try {
        const { type, path: filePath, content } = op;
        
        if (!type || !filePath) {
          throw new Error("Operation missing required fields: type, path");
        }
        
        if (content && content.length > 1000000) {
          throw new Error("Content too large (max 1MB)");
        }
        
        const absolutePath = validatePath(filePath);
        
        let backup = null;
        if (type === "update" || type === "delete") {
          if (fs.existsSync(absolutePath)) {
            backup = createBackup(absolutePath);
            if (backup) {
              patch.backups.push({ file: absolutePath, backup });
            }
          }
        }
        
        if (type === "create" || type === "update") {
          const dir = path.dirname(absolutePath);
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(absolutePath, content || "", "utf8");
          opSuccess = true;
          
        } else if (type === "delete") {
          if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            opSuccess = true;
          } else {
            opError = "File not found";
          }
        } else {
          opError = "Unknown operation type";
        }
        
        results.push({ 
          type, 
          path: filePath, 
          success: opSuccess,
          error: opError 
        });
        
        patch.operations.push({ 
          type, 
          path: filePath, 
          success: opSuccess,
          error: opError 
        });
        
        if (opSuccess) {
          appliedOps.push({ type, absolutePath });
        }
        
      } catch (error) {
        const sanitizedError = sanitizeError(error, op.path);
        results.push({ 
          type: op.type, 
          path: op.path, 
          success: false, 
          error: sanitizedError 
        });
        patch.operations.push({ 
          type: op.type, 
          path: op.path, 
          success: false, 
          error: sanitizedError 
        });
      }
    }
    
    const hasErrors = results.some(r => !r.success);
    patch.status = hasErrors ? "partial" : "success";
    
    const patches = loadPatches();
    patches.unshift(patch);
    
    if (patches.length > 100) {
      patches.splice(100);
    }
    
    savePatches(patches);
    
    res.json({
      success: !hasErrors,
      patchId: patch.id,
      results,
      message: hasErrors 
        ? "Patch applied with some errors" 
        : "Patch applied successfully"
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: sanitizeError(error, 'operation') 
    });
  }
});

router.get("/patch/list", (req, res) => {
  try {
    const patches = loadPatches();
    const safePatchesForClient = patches.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      timestamp: p.timestamp,
      status: p.status,
      rolledBack: p.rolledBack,
      rollbackTime: p.rollbackTime,
      operations: p.operations.map(op => ({
        type: op.type,
        path: op.path,
        success: op.success,
        error: op.error
      })),
      backups: p.backups.map(b => ({
        file: path.relative(PROJECT_ROOT, b.file),
        hasBackup: true
      }))
    }));
    res.json({ success: true, patches: safePatchesForClient });
  } catch (error) {
    res.status(500).json({ success: false, error: sanitizeError(error, 'list operation') });
  }
});

router.post("/patch/rollback/:patchId", (req, res) => {
  try {
    const { patchId } = req.params;
    const patches = loadPatches();
    const patch = patches.find(p => p.id === patchId);
    
    if (!patch) {
      return res.status(404).json({ 
        success: false, 
        error: "Patch not found" 
      });
    }
    
    if (patch.rolledBack) {
      return res.status(400).json({ 
        success: false, 
        error: "Patch already rolled back" 
      });
    }
    
    const results = [];
    
    for (const backup of patch.backups) {
      try {
        const validatedBackup = validateBackupPath(backup.backup);
        const validatedTarget = validatePath(path.relative(PROJECT_ROOT, backup.file));
        
        fs.copyFileSync(validatedBackup, validatedTarget);
        results.push({ 
          file: path.relative(PROJECT_ROOT, backup.file), 
          success: true 
        });
      } catch (error) {
        results.push({ 
          file: path.relative(PROJECT_ROOT, backup.file), 
          success: false, 
          error: sanitizeError(error, path.relative(PROJECT_ROOT, backup.file)) 
        });
      }
    }
    
    for (const op of patch.operations) {
      if (op.type === "create" && op.success) {
        try {
          const absolutePath = validatePath(op.path);
          if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            results.push({ file: op.path, success: true, action: "removed" });
          }
        } catch (error) {
          results.push({ 
            file: op.path, 
            success: false, 
            error: sanitizeError(error, op.path) 
          });
        }
      }
    }
    
    const hasFailures = results.some(r => !r.success);
    
    if (hasFailures) {
      return res.status(500).json({
        success: false,
        message: "Rollback failed - some operations could not be completed",
        results
      });
    }
    
    patch.rolledBack = true;
    patch.rollbackTime = new Date().toISOString();
    savePatches(patches);
    
    res.json({
      success: true,
      message: "Patch rolled back successfully",
      results
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: sanitizeError(error, 'operation') 
    });
  }
});

module.exports = router;
