# File Encryption Feature

## Overview

The Notas extension now includes file encryption capabilities using RSA public/private key encryption. Files are encrypted in-place and can only be viewed/edited through the extension.

## How It Works

### Architecture
- **Hybrid Encryption**: Uses RSA for key exchange and AES-256-GCM for file content
- **In-Place Encryption**: Encrypted content replaces the original file
- **Virtual Editing**: Decrypted content is only shown in a virtual editor (never written to disk unencrypted)
- **Auto-Save Encryption**: When you save changes in the decrypted view, content is automatically re-encrypted

### File Format
Encrypted files are stored as JSON with this structure:
```json
{
  "notas_encrypted": true,
  "version": "1.0",
  "algorithm": {
    "asymmetric": "rsa-oaep",
    "symmetric": "aes-256-gcm"
  },
  "encryptedData": "base64...",
  "encryptedAesKey": "base64...",
  "iv": "base64...",
  "authTag": "base64...",
  "timestamp": "2026-02-11T..."
}
```

## Setup

### 1. Generate RSA Key Pair (if you don't have one)

Using OpenSSL (modern approach):
```bash
# Generate private key (2048-bit)
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048

# Generate public key from private key
openssl rsa -in private.pem -pubout -out public.pem
```

Or using 4096-bit for higher security:
```bash
# Generate 4096-bit private key
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:4096

# Generate public key
openssl rsa -in private.pem -pubout -out public.pem
```

### 2. Configure Key Paths in VS Code

1. Open VS Code Settings
2. Search for `notas encryption`
3. Set **Notas › Encryption: Public Key Path** to your `public.pem` file
4. Set **Notas › Encryption: Private Key Path** to your `private.pem` file

**Note**: Key paths are stored in VS Code settings. Existing paths previously stored via the extension's secret storage are migrated automatically the first time they are read.

### 3. Using Existing SSH Keys (Optional)

You can use your existing SSH keys:
- Public key: `~/.ssh/id_rsa.pub`
- Private key: `~/.ssh/id_rsa`

However, SSH keys may need conversion:
```bash
# Convert SSH public key to PEM format
ssh-keygen -f ~/.ssh/id_rsa.pub -e -m pem > public.pem

# Private key is usually already in PEM format
cp ~/.ssh/id_rsa private.pem
```

## Usage

### Encrypt a File (Lock)

1. Right-click on any file in Explorer
2. Select **"Notas: Lock File (Encrypt)"**
3. Confirm the action
4. File will be encrypted in-place

**What happens**:
- Original plaintext content is encrypted
- File is overwritten with encrypted JSON structure
- File shows a 🔒 icon in Explorer

### Decrypt and Edit a File (Unlock)

1. Right-click on an encrypted file (marked with 🔒)
2. Select **"Notas: Unlock File (Decrypt)"**
3. Decrypted content opens in a new editor tab

**What happens**:
- Content is decrypted using your private key
- Opens in a virtual editor (scheme: `decrypted:`)
- File on disk remains encrypted

### Save Changes

1. Edit the decrypted content in the virtual editor
2. Press `Ctrl+S` (or `Cmd+S` on Mac) to save
3. Content is automatically re-encrypted and saved to disk

**What happens**:
- Content is encrypted with your public key
- Encrypted version is written to the original file
- Virtual editor stays open for continued editing

### Commit to Git

Encrypted files can be committed to git normally:
```bash
git add myfile.txt
git commit -m "Add encrypted file"
git push
```

**Benefits**:
- Only encrypted content is ever committed
- No git hooks needed
- Works with standard git workflow

## Security Considerations

### ✅ Good Practices

1. **Keep private keys secure**:
   - Store outside of your project directory
   - Never commit private keys to git
   - Use strong file permissions (`chmod 600 private.pem`)

2. **Use strong keys**:
   - Minimum 2048-bit RSA keys
   - 4096-bit recommended for sensitive data

3. **Backup your private key**:
   - Store securely (password manager, encrypted backup)
   - Without it, encrypted files cannot be recovered

4. **Key rotation**:
   - Periodically generate new keys
   - Re-encrypt files with new public key

### ⚠️ Important Notes

- **Decrypted content only exists in memory**: The virtual editor never writes plaintext to disk
- **Auto-save encrypts immediately**: No risk of accidentally committing plaintext
- **File format is self-describing**: Easy to detect encrypted files programmatically
- **No cloud storage**: Keys stay on your local machine only

## Troubleshooting

### "Encryption keys not configured"
- Make sure you've set both public and private key paths in VS Code Settings (`notas.encryption.publicKeyPath` and `notas.encryption.privateKeyPath`)

### "Failed to read public/private key"
- Check that the key files exist at the configured paths
- Verify file permissions (you need read access)
- Ensure keys are in PEM format

### "Failed to decrypt file"
- Verify the private key matches the public key used for encryption
- Check that the file is actually encrypted (look for JSON format)
- The file may have been encrypted with a different key

### "Failed to encrypt and save"
- Ensure the public key path is correct
- Check that you have write permissions for the file
- Verify the public key is valid PEM format

## Example Workflow

```bash
# 1. Generate keys (one time)
openssl genpkey -algorithm RSA -out ~/keys/notas-private.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -in ~/keys/notas-private.pem -pubout -out ~/keys/notas-public.pem

# 2. Configure in VS Code Settings
# Public key: /Users/you/keys/notas-public.pem
# Private key: /Users/you/keys/notas-private.pem

# 3. Encrypt a file
# Right-click myfile.txt → "Lock File (Encrypt)"

# 4. Edit encrypted file
# Right-click myfile.txt → "Unlock File (Decrypt)"
# Edit in virtual editor
# Ctrl+S to save (auto-encrypts)

# 5. Commit to git
git add myfile.txt
git commit -m "Update encrypted file"
git push
```

## File Decorations

- 🔒 **Encrypted files**: Show lock icon in Explorer
- Virtual editor title shows: `filename.txt (Decrypted)`

## Limitations

- Only text-based files are supported (binary files may not work correctly)
- Very large files (>10MB) may be slow to encrypt/decrypt
- No file sharing features (each user needs their own keys)
- No key management UI (use command line tools)

## Future Enhancements

Potential features for future versions:
- Multi-user encryption (encrypt for multiple public keys)
- Key generation UI
- Encrypted file search
- Batch encrypt/decrypt operations
- Password-protected private keys support
