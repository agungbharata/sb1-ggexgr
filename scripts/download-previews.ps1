$templates = @(
    @{name = "Javanese+Template"; file = "javanese.jpg"},
    @{name = "Sundanese+Template"; file = "sundanese.jpg"},
    @{name = "Minang+Template"; file = "minang.jpg"},
    @{name = "Balinese+Template"; file = "bali.jpg"},
    @{name = "Modern+Template"; file = "modern.jpg"}
)

$previewsPath = "..\public\previews"
foreach ($template in $templates) {
    $url = "https://via.placeholder.com/600x800/FF69B4/FFFFFF?text=$($template.name)"
    $output = Join-Path $previewsPath $template.file
    Invoke-WebRequest -Uri $url -OutFile $output
    Write-Host "Downloaded $($template.file)"
}
