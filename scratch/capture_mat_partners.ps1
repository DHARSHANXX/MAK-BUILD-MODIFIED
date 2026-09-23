$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$artifactsDir = "C:\Users\DHARSHAN\.gemini\antigravity\brain\4a32252f-1f0e-4131-8d2d-440c322de3e1"
$projectDir = "C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build"
$indexHtml = "$projectDir\index.html"
$content = [System.IO.File]::ReadAllText($indexHtml, [System.Text.Encoding]::UTF8)

# Extract only from <div class="mt-10 pt-8 to </div></div>
$sTag = '<div class="mt-10 pt-8 border-t border-slate-800/80 space-y-4">'
$start = $content.IndexOf($sTag)
$eTag = '<!-- Kolam Repeating Diamond Geometric Motif Divider -->'
$end = $content.IndexOf($eTag, $start)
$raw = $content.Substring($start, $end - $start)

# Take up to the 7th </div>
$pos = 0
for ($i = 0; $i -lt 8; $i++) {
    $pos = $raw.IndexOf('</div>', $pos) + 6
}
$matClean = $raw.Substring(0, $pos)

$html = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="stylesheet" href="styles.css" />
</head>
<body class="bg-[#080b11] p-6 text-white relative min-h-screen">
  <div class="lively-ambient-bg" aria-hidden="true">
    <div class="ambient-blueprint-grid"></div>
    <div class="ambient-glow-orb-1"></div>
  </div>
  <div class="max-w-6xl mx-auto py-4">
    $matClean
  </div>
  <script>
    if (window.lucide) { lucide.createIcons(); }
  </script>
</body>
</html>
"@

$temp = "$projectDir\temp_mat_clean.html"
[System.IO.File]::WriteAllText($temp, $html, [System.Text.Encoding]::UTF8)

Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\qa_material_partners_desktop.png",
    '--window-size=1280,300',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$temp"
) -Wait

Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\qa_material_partners_mobile_390.png",
    '--window-size=390,350',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$temp"
) -Wait

Remove-Item $temp -Force -ErrorAction SilentlyContinue
Write-Output "Material partners QA complete."
