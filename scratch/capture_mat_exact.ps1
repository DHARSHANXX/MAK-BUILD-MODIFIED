$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$artifactsDir = "C:\Users\DHARSHAN\.gemini\antigravity\brain\4a32252f-1f0e-4131-8d2d-440c322de3e1"
$projectDir = "C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build"

$html = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="styles.css" />
</head>
<body class="bg-[#080b11] p-6 text-white relative min-h-screen">
  <div class="lively-ambient-bg" aria-hidden="true">
    <div class="ambient-blueprint-grid"></div>
  </div>
  <div class="max-w-6xl mx-auto py-8 relative z-10">
    <div class="mt-4 pt-4 border-t border-slate-800/80 space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <span class="text-xs uppercase tracking-widest text-[#d4af37] font-bold font-heading flex items-center gap-1.5">
          <svg class="w-4 h-4 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Tested Grade-A Material Partners:
        </span>
        <span class="text-[11px] text-slate-400 font-light hidden sm:inline">Certified BIS Quality &bull; 100% Original Sourcing</span>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-3.5 w-full">
        <div class="bg-slate-900/90 border border-slate-800 hover:border-[#d4af37]/50 rounded-xl px-2 sm:px-3 py-2.5 sm:py-3 text-center flex items-center justify-center transition-all shadow-sm group min-h-[48px]">
          <span class="text-[9.5px] sm:text-[11px] lg:text-xs font-semibold text-slate-200 group-hover:text-white uppercase tracking-wide leading-tight">UltraTech Cement</span>
        </div>
        <div class="bg-slate-900/90 border border-slate-800 hover:border-[#d4af37]/50 rounded-xl px-2 sm:px-3 py-2.5 sm:py-3 text-center flex items-center justify-center transition-all shadow-sm group min-h-[48px]">
          <span class="text-[9.5px] sm:text-[11px] lg:text-xs font-semibold text-slate-200 group-hover:text-white uppercase tracking-wide leading-tight">Tata Tiscon Fe 550D</span>
        </div>
        <div class="bg-slate-900/90 border border-slate-800 hover:border-[#d4af37]/50 rounded-xl px-2 sm:px-3 py-2.5 sm:py-3 text-center flex items-center justify-center transition-all shadow-sm group min-h-[48px]">
          <span class="text-[9.5px] sm:text-[11px] lg:text-xs font-semibold text-slate-200 group-hover:text-white uppercase tracking-wide leading-tight">Saint-Gobain Glass</span>
        </div>
        <div class="bg-slate-900/90 border border-slate-800 hover:border-[#d4af37]/50 rounded-xl px-2 sm:px-3 py-2.5 sm:py-3 text-center flex items-center justify-center transition-all shadow-sm group min-h-[48px]">
          <span class="text-[9.5px] sm:text-[11px] lg:text-xs font-semibold text-slate-200 group-hover:text-white uppercase tracking-wide leading-tight">Jindal Steel (JSW)</span>
        </div>
        <div class="bg-slate-900/90 border border-slate-800 hover:border-[#d4af37]/50 rounded-xl px-2 sm:px-3 py-2.5 sm:py-3 text-center flex items-center justify-center transition-all shadow-sm group min-h-[48px]">
          <span class="text-[9.5px] sm:text-[11px] lg:text-xs font-semibold text-slate-200 group-hover:text-white uppercase tracking-wide leading-tight">Asian Paints Royale</span>
        </div>
        <div class="bg-slate-900/90 border border-slate-800 hover:border-[#d4af37]/50 rounded-xl px-2 sm:px-3 py-2.5 sm:py-3 text-center flex items-center justify-center transition-all shadow-sm group min-h-[48px]">
          <span class="text-[9.5px] sm:text-[11px] lg:text-xs font-semibold text-slate-200 group-hover:text-white uppercase tracking-wide leading-tight">Kohler &amp; Jaquar</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
'@

$temp = "$projectDir\temp_mat_exact.html"
[System.IO.File]::WriteAllText($temp, $html, [System.Text.Encoding]::UTF8)

Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\qa_material_partners_desktop.png",
    '--window-size=1280,260',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$temp"
) -Wait

Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\qa_material_partners_mobile_390.png",
    '--window-size=390,320',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$temp"
) -Wait

Remove-Item $temp -Force -ErrorAction SilentlyContinue
Write-Output "Material partners capture done."
