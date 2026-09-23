$projectDir = "C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build"
$origHtml = "$projectDir\index.html"
$content = [System.IO.File]::ReadAllText($origHtml, [System.Text.Encoding]::UTF8)

# In temp file, make header and hero display:none so #transformation is right at top
$mod = $content -replace '<header class="sticky', '<header style="display:none;" class="sticky'
$mod = $mod -replace '<section class="hero-slider-container', '<section style="display:none;" class="hero-slider-container'
$mod = $mod -replace '<section id="hiring"', '<section style="display:none;" id="hiring"'
$mod = $mod -replace '<section id="services"', '<section style="display:none;" id="services"'
$mod = $mod -replace '<section id="cost-estimator"', '<section style="display:none;" id="cost-estimator"'

$tempFile = "$projectDir\temp_ba_direct.html"
[System.IO.File]::WriteAllText($tempFile, $mod, [System.Text.Encoding]::UTF8)

$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$artifactsDir = "C:\Users\DHARSHAN\.gemini\antigravity\brain\4a32252f-1f0e-4131-8d2d-440c322de3e1"

# 1. Desktop 1280x950
Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\verified_new_ba_desktop.png",
    '--window-size=1280,950',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$tempFile"
) -Wait

# 2. Mobile 390x900
Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\verified_new_ba_mobile_390.png",
    '--window-size=390,900',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$tempFile"
) -Wait

Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
Write-Output "Direct BA captures complete."
