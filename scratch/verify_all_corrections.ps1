$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$artifactsDir = "C:\Users\DHARSHAN\.gemini\antigravity\brain\4a32252f-1f0e-4131-8d2d-440c322de3e1"
$projectDir = "C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build"
$indexHtml = "$projectDir\index.html"
$content = [System.IO.File]::ReadAllText($indexHtml, [System.Text.Encoding]::UTF8)

function Make-TestHtml($bodyContent, $containerClasses = "max-w-5xl mx-auto p-4") {
    return @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="stylesheet" href="styles.css" />
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            keyboard: ['Inter', 'system-ui', 'sans-serif'],
            logo: ['Montserrat', 'sans-serif']
          }
        }
      }
    }
  </script>
</head>
<body class="bg-[#080b11] text-slate-100 p-4 sm:p-6 relative min-h-screen">
  <div class="lively-ambient-bg" aria-hidden="true">
    <div class="ambient-blueprint-grid"></div>
    <div class="ambient-glow-orb-1"></div>
  </div>
  <div class="$containerClasses">
    $bodyContent
  </div>
  <script>
    if (window.lucide) { lucide.createIcons(); }
  </script>
</body>
</html>
"@
}

# 1. Header capture (Desktop 1280px)
Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\qa_header_desktop_1280.png",
    '--window-size=1280,300',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$indexHtml"
) -Wait

# 2. Material Partners capture (Desktop 1280px)
$matStart = $content.IndexOf('<!-- Raw Materials Partners Strip')
$matEnd = $content.IndexOf('<!-- Kolam Repeating Diamond Geometric Motif Divider -->', $matStart)
$matInner = $content.Substring($matStart, $matEnd - $matStart)
# Ensure trailing unmatched divs are clean
$matInner = $matInner.Replace("</div>`n`n    </div>`n  </section>", "</div>")
$htmlMat = Make-TestHtml $matInner "max-w-6xl mx-auto py-6"
$tempMat = "$projectDir\temp_mat_test.html"
[System.IO.File]::WriteAllText($tempMat, $htmlMat, [System.Text.Encoding]::UTF8)

Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\qa_material_partners_desktop.png",
    '--window-size=1280,350',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$tempMat"
) -Wait
Remove-Item $tempMat -Force -ErrorAction SilentlyContinue

# 3. Hiring CTAs capture (Mobile 390px)
$hiringStart = $content.IndexOf('<!-- Consolidated Application CTAs -->')
$hiringEnd = $content.IndexOf('<!-- Kolam Repeating Diamond Geometric Motif Divider -->', $hiringStart)
if ($hiringEnd -lt 0) { $hiringEnd = $content.IndexOf('</section>', $hiringStart) }
$hiringInner = $content.Substring($hiringStart, $hiringEnd - $hiringStart)
$hiringInner = $hiringInner.Replace("</div>`n`n        </div>`n`n      </div>", "</div>")
$htmlHiring = Make-TestHtml "<div class='glass-card p-5 rounded-2xl border border-slate-800'>$hiringInner</div>" "max-w-sm mx-auto"
$tempHiring = "$projectDir\temp_hiring_test.html"
[System.IO.File]::WriteAllText($tempHiring, $htmlHiring, [System.Text.Encoding]::UTF8)

Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\qa_hiring_single_line_mobile_390.png",
    '--window-size=390,380',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$tempHiring"
) -Wait
Remove-Item $tempHiring -Force -ErrorAction SilentlyContinue

# 4. Contact Cards capture (Mobile 390px)
$contactStart = $content.IndexOf('<div class="space-y-4">', $content.IndexOf('Let''s Build In Sirkazhi'))
$contactEnd = $content.IndexOf('<!-- Right: Inquiry Form', $contactStart)
$contactInner = $content.Substring($contactStart, $contactEnd - $contactStart)
$htmlContact = Make-TestHtml $contactInner "max-w-sm mx-auto"
$tempContact = "$projectDir\temp_contact_test.html"
[System.IO.File]::WriteAllText($tempContact, $htmlContact, [System.Text.Encoding]::UTF8)

Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\qa_contact_cards_mobile_390.png",
    '--window-size=390,650',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$tempContact"
) -Wait
Remove-Item $tempContact -Force -ErrorAction SilentlyContinue

# 5. Full Footer capture (Desktop 1280px & Mobile 390px)
$footerStart = $content.IndexOf('<footer')
$footerEnd = $content.IndexOf('</footer>') + 9
$footerInner = $content.Substring($footerStart, $footerEnd - $footerStart)
$htmlFooter = Make-TestHtml $footerInner "w-full"
$tempFooter = "$projectDir\temp_footer_test.html"
[System.IO.File]::WriteAllText($tempFooter, $htmlFooter, [System.Text.Encoding]::UTF8)

Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\qa_footer_desktop_1280.png",
    '--window-size=1280,500',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$tempFooter"
) -Wait

Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\qa_footer_mobile_390.png",
    '--window-size=390,850',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$tempFooter"
) -Wait
Remove-Item $tempFooter -Force -ErrorAction SilentlyContinue

Write-Output "Clean QA captures successfully generated."
