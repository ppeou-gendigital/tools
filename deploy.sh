
#!/bin/bash

 # Get the current date and time in ISO 8601 format
 current_date=$(date -u +"%Y%m%dT%H%M%SZ")

 # Define the folder to be zipped
 folder_to_zip="build"

new_name="${folder_to_zip}-${current_date}"

 # Copy the folder and rename it
 cp -r "$folder_to_zip" "$new_name"


 # Define the name of the zip file
 zip_file_name="$new_name.zip"

 # Create the zip file
 zip -r "$zip_file_name" "$new_name"
 rm -rf "$new_name"

 echo "Folder '$new_name' has been zipped as '$zip_file_name'"
