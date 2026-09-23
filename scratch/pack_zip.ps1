$projectDir = "C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build"
$zipPath = "C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build.zip"

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

$itemsToZip = @(
    "$projectDir\index.html",
    "$projectDir\styles.css",
    "$projectDir\app.js",
    "$projectDir\README.md",
    "$projectDir\assets"
)

Compress-Archive -Path $itemsToZip -DestinationPath $zipPath -CompressionLevel Optimal
Write-Output "Zip archive created at $zipPath with size: $((Get-Item $zipPath).Length) bytes."
