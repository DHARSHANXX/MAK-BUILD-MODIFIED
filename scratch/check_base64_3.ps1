$txt = Get-Content "assets\ba-after-base64.txt"
$prefix = "data:image/jpeg;base64,"
$cleanTxt = if ($txt.StartsWith($prefix)) { $txt.Substring($prefix.Length) } else { $txt }
$fileBytes = [System.IO.File]::ReadAllBytes("assets\penthouse-after-hd.jpg")
$fileBase64 = [Convert]::ToBase64String($fileBytes)
Write-Output "Clean match: $($cleanTxt.Trim() -eq $fileBase64.Trim())"
