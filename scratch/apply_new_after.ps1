$source = "C:\Users\DHARSHAN\.gemini\antigravity\brain\4a32252f-1f0e-4131-8d2d-440c322de3e1\.user_uploaded\media_1790167703896.jpg"
$destDir = "C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build"

# Copy image to all target after image paths
Copy-Item $source "$destDir\assets\penthouse-after-hd.jpg" -Force
Copy-Item $source "$destDir\assets\renovation-after-web.jpg" -Force
Copy-Item $source "$destDir\assets\renovation-after.jpg" -Force
Copy-Item $source "$destDir\after-room.jpg" -Force
Copy-Item $source "$destDir\live-after.jpg" -Force
Copy-Item $source "$destDir\test-after.jpg" -Force

# Read bytes and convert to base64
$bytes = [System.IO.File]::ReadAllBytes($source)
$b64 = [Convert]::ToBase64String($bytes)
$dataUri = "data:image/jpeg;base64," + $b64

# Write to assets/ba-after-base64.txt
[System.IO.File]::WriteAllText("$destDir\assets\ba-after-base64.txt", $dataUri, [System.Text.Encoding]::UTF8)

Write-Output "Files copied and base64 generated successfully. Size: $($b64.Length) chars."
