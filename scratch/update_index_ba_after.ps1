$newDataUri = (Get-Content "assets\ba-after-base64.txt").Trim()
$lines = [System.IO.File]::ReadAllLines("index.html")

# Find line 54 (0-indexed 53)
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i].TrimStart().StartsWith("window.MAK_BA_AFTER = ")) {
        $lines[$i] = "    window.MAK_BA_AFTER = `"$newDataUri`";"
        Write-Output "Found and updated line $($i+1)"
        break
    }
}

[System.IO.File]::WriteAllLines("index.html", $lines)
Write-Output "index.html updated successfully."
