$projectDir = "C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build"
$origHtml = "$projectDir\index.html"
$content = [System.IO.File]::ReadAllText($origHtml, [System.Text.Encoding]::UTF8)

# Cut out everything before <footer ...>
$bodyStart = $content.IndexOf('<body')
$bodyTagEnd = $content.IndexOf('>', $bodyStart) + 1
$footerStart = $content.IndexOf('<footer')

$headPart = $content.Substring(0, $bodyTagEnd)
$footerPart = $content.Substring($footerStart)
$cleanHtml = $headPart + "`n" + $footerPart

$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$artifactsDir = "C:\Users\DHARSHAN\.gemini\antigravity\brain\4a32252f-1f0e-4131-8d2d-440c322de3e1"

$tempFile = "$projectDir\temp_footer_only.html"
[System.IO.File]::WriteAllText($tempFile, $cleanHtml, [System.Text.Encoding]::UTF8)

Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\verified_footer_desktop.png",
    '--window-size=1280,800',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$tempFile"
) -Wait

Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\verified_footer_mobile_390.png",
    '--window-size=390,900',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$tempFile"
) -Wait

Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
Write-Output "Footer captures complete."
