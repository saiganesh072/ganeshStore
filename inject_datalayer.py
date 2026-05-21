import os
import glob

def inject_datalayer():
    # Path to search for HTML files
    base_dir = os.path.dirname(os.path.abspath(__file__))
    html_pattern = os.path.join(base_dir, "*.html")
    html_files = glob.glob(html_pattern)
    
    script_tag = '  <script src="js/datalayer.js"></script>\n'
    modified_count = 0
    skipped_count = 0

    print("Starting Adobe Client Data Layer injection automation...")
    
    for file_path in html_files:
        basename = os.path.basename(file_path)
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Check if the datalayer script tag is already present
        if "js/datalayer.js" in content:
            print(f"Skipped (Already Injected): {basename}")
            skipped_count += 1
            continue

        # Look for closing head tag to inject right before it
        if "</head>" in content:
            updated_content = content.replace("</head>", f"{script_tag}</head>", 1)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(updated_content)
            print(f"Successfully Injected: {basename}")
            modified_count += 1
        else:
            print(f"Warning (No </head> found): {basename}")

    print("\nInjection Automation Summary:")
    print(f"   - Total HTML Files found: {len(html_files)}")
    print(f"   - Successfully injected:  {modified_count}")
    print(f"   - Already injected:       {skipped_count}")

if __name__ == "__main__":
    inject_datalayer()
