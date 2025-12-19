import os
import numpy as np
import nibabel as nib
import matplotlib.pyplot as plt
from scipy.ndimage import binary_erosion, binary_dilation

# --- CONFIGURATION ---
# UPDATE THESE TO MATCH YOUR EXACT FILENAMES
# Note: I removed the .gz extension
FLAIR_PATH = 'BraTS20_Training_001_flair.nii' 
SEG_PATH =   'BraTS20_Training_001_seg.nii'

SLICE_IDX = 97

# 3. Where to save the React assets
OUTPUT_DIR = '/Users/mchatni/Projects/radiology-sandbox-demo/public/assets'

# --- HELPER FUNCTION ---
def save_transparent_png(mask_data, color_rgb, filename):
    """
    Takes a binary mask and saves it as a PNG with a transparent background.
    color_rgb: Tuple (R, G, B) in range 0-255
    """
    height, width = mask_data.shape
    # Create an RGBA image (4 channels: Red, Green, Blue, Alpha)
    rgba_image = np.zeros((height, width, 4), dtype=np.uint8)

    # Where mask is True, set the color
    rgba_image[mask_data > 0, 0] = color_rgb[0] # R
    rgba_image[mask_data > 0, 1] = color_rgb[1] # G
    rgba_image[mask_data > 0, 2] = color_rgb[2] # B
    
    # Set Alpha (Transparency): 0 = Invisible, 255 = Solid. 
    # We use 180 for a nice "glassy" overlay effect.
    rgba_image[mask_data > 0, 3] = 180 

    # Save
    out_path = os.path.join(OUTPUT_DIR, filename)
    plt.imsave(out_path, rgba_image)
    print(f"✅ Saved: {out_path}")

# --- MAIN LOGIC ---
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

print(f"Loading Medical Volumes from: {FLAIR_PATH}...")

try:
    # 1. Load the 3D Volumes (Nibabel handles .nii automatically)
    flair_vol = nib.load(FLAIR_PATH).get_fdata()
    seg_vol = nib.load(SEG_PATH).get_fdata()

    # 2. Extract the specific 2D Slice
    # Standard orientation correction (rotate 90 degrees) so head is up
    img_slice = np.rot90(flair_vol[:, :, SLICE_IDX])
    seg_slice = np.rot90(seg_vol[:, :, SLICE_IDX])

    # 3. Simplify Segmentation
    # BraTS uses labels 1, 2, 4. We combine them all into "Tumor vs Background"
    binary_mask = (seg_slice > 0).astype(np.uint8)

    # --- GENERATE ASSET 1: The Base Image ---
    # Save as Greyscale
    plt.imsave(os.path.join(OUTPUT_DIR, 'mri_base.png'), img_slice, cmap='gray')
    print(f"✅ Saved: {OUTPUT_DIR}/mri_base.png")

    # --- GENERATE ASSET 2: Model A (Conservative/Under-segmented) ---
    # "Erosion" shrinks the mask to simulate a model that misses the edges
    mask_conservative = binary_erosion(binary_mask, iterations=4)
    save_transparent_png(mask_conservative, (59, 130, 246), 'mask_conservative.png') # Blue

    # --- GENERATE ASSET 3: Model B (Aggressive/Over-segmented) ---
    # "Dilation" expands the mask to simulate a model that grabs too much healthy tissue
    mask_aggressive = binary_dilation(binary_mask, iterations=4)
    save_transparent_png(mask_aggressive, (239, 68, 68), 'mask_aggressive.png') # Red

    # --- GENERATE ASSET 4: Model C (Gold Standard) ---
    # The actual ground truth
    save_transparent_png(binary_mask, (16, 185, 129), 'mask_gold.png') # Emerald Green

    print("\n🎉 SUCCESS! Copy the contents of the 'react_assets' folder into your React project's '/public/assets/' folder.")

except FileNotFoundError:
    print("\n❌ ERROR: Could not find the .nii files.")
    print(f"Make sure '{FLAIR_PATH}' and '{SEG_PATH}' are in this same folder.")