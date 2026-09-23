$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$outDir = "C:\Users\DHARSHAN\.gemini\antigravity\brain\4a32252f-1f0e-4131-8d2d-440c322de3e1"
$liveScreen = Join-Path $outDir "live_site_ba_screenshot.png"

# Capture live page at transformation section
Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$liveScreen",
    '--window-size=1280,3000',
    '--hide-scrollbars',
    '--disable-gpu',
    'https://dharshanxx.github.io/MAK-BUILD-MODIFIED/'
) -Wait
Write-Host "Live capture complete: $liveScreen"
