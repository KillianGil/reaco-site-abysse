#!/bin/bash

# Script to compress GLB models with Draco
# This significantly reduces file sizes (typically 50-90% smaller)

MODELS_DIR="public/models"
BACKUP_DIR="public/models-backup"

echo "🗜️  Starting Draco compression for GLB models..."
echo ""

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to compress a single model
compress_model() {
    local input="$1"
    local filename=$(basename "$input")
    local backup="$BACKUP_DIR/$filename"

    # Get original size
    local original_size=$(ls -lh "$input" | awk '{print $5}')

    echo "📦 Processing: $filename ($original_size)"

    # Backup original
    cp "$input" "$backup"

    # Compress with Draco
    npx gltf-transform draco "$input" "$input" --method edgebreaker 2>/dev/null

    # Get new size
    local new_size=$(ls -lh "$input" | awk '{print $5}')

    echo "   ✅ Compressed: $original_size → $new_size"
    echo ""
}

# Compress all GLB files
echo "Compressing models in $MODELS_DIR..."
echo ""

# Main models
for model in "$MODELS_DIR"/*.glb; do
    if [ -f "$model" ]; then
        compress_model "$model"
    fi
done

# Fish models
for model in "$MODELS_DIR"/poisson/*.glb; do
    if [ -f "$model" ]; then
        compress_model "$model"
    fi
done

echo "✨ Compression complete!"
echo "📁 Original files backed up to: $BACKUP_DIR"
