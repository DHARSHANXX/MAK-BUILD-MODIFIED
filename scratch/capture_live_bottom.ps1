$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$artifactsDir = "C:\Users\DHARSHAN\.gemini\antigravity\brain\4a32252f-1f0e-4131-8d2d-440c322de3e1"

Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\live_site_bottom_390.png",
    '--window-size=390,1200',
    '--hide-scrollbars',
    '--disable-gpu',
    'https://dharshanxx.github.io/MAK-BUILD-MODIFIED/#contact'
) -Wait
Write-Output "Live site contact captured."
