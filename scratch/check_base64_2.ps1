$txt = Get-Content "assets\ba-after-base64.txt"
Write-Output $txt.Substring(0, 50)
$fileBytes = [System.IO.File]::ReadAllBytes("assets\penthouse-after-hd.jpg")
$fileBase64 = [Convert]::ToBase64String($fileBytes)
Write-Output $fileBase64.Substring(0, 50)
Write-Output "Trim match: $($txt.Trim() -eq $fileBase64.Trim())"
