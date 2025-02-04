<?php
// Set directory paths and base URLs
$tools_dir       = $_SERVER['DOCUMENT_ROOT'] . '/a/';          // Path to your tools folder
$tools_base_url  = "https://x0.rf.gd/a/";                        // Base URL for tool links
$icons8_base_url = "https://img.icons8.com/color/96/";           // Icons8 URL base
$default_icon_url = "https://x0.rf.gd/a/icon/default.png";       // Default icon if Icons8 fails

/**
 * Get the automatic icon for a tool from Icons8.
 * If the icon is not available (cannot be fetched), return the default icon.
 *
 * @param string $tool_name   The name of the tool (folder).
 * @param string $icons8_base Base URL for Icons8 icons.
 * @param string $default_icon URL of the default icon.
 *
 * @return string URL to the icon image.
 */
function getToolIcon($tool_name, $icons8_base, $default_icon) {
    // Normalize the tool name for use in the URL
    // (Convert to lowercase and replace spaces with hyphens)
    $normalized = strtolower(str_replace(' ', '-', $tool_name));
    $icon_url = $icons8_base . $normalized . ".png";

    // Use @ to suppress warnings; getimagesize returns false if the image doesn't exist
    if (@getimagesize($icon_url)) {
        return $icon_url;
    } else {
        return $default_icon;
    }
}

/**
 * Get a random color from a predefined list.
 *
 * @return string A hex color code.
 */
function getRandomColor() {
    $colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#F9C300', '#6B5B95'];
    return $colors[array_rand($colors)];
}

// Begin outputting the HTML
echo "<!DOCTYPE html>";
echo "<html lang='en'>";
echo "<head>";
echo "  <meta charset='UTF-8'>";
echo "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>";
echo "  <title>All Tools</title>";
echo "  <link rel='icon' href='https://x0.rf.gd/favicon.ico' type='image/x-icon'>";
echo "  <style>";
echo "    body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; }";
echo "    h1 { color: #333; text-align: center; }";
echo "    .container { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); grid-gap: 20px; padding: 20px; }";
echo "    .tool-box { background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; transition: transform 0.3s ease; }";
echo "    .tool-box:hover { transform: translateY(-5px); }";
echo "    .tool-icon img { width: 50px; height: 50px; margin-bottom: 10px; }";
echo "    .tool-title { font-size: 1.2em; font-weight: bold; text-decoration: none; }";
echo "    .tool-title:hover { text-decoration: underline; }";
echo "  </style>";
echo "</head>";
echo "<body>";

echo "  <h1>All Tools</h1>";
echo "  <div class='container'>";

// Verify that the tools directory exists
if (is_dir($tools_dir)) {
    // Scan the directory for files/folders (skip '.' and '..')
    $tools = array_diff(scandir($tools_dir), array('..', '.'));
    foreach ($tools as $tool) {
        // Only consider directories (each directory represents a tool)
        if (is_dir($tools_dir . $tool)) {
            $icon_url = getToolIcon($tool, $icons8_base_url, $default_icon_url);
            $color = getRandomColor();
            echo "  <div class='tool-box'>";
            echo "    <div class='tool-icon'><img src='{$icon_url}' alt='{$tool}'></div>";
            echo "    <a href='{$tools_base_url}{$tool}/' class='tool-title' style='color: {$color};'>{$tool}</a>";
            echo "  </div>";
        }
    }
} else {
    echo "  <p>No tools found.</p>";
}

echo "  </div>";
echo "</body>";
echo "</html>";
?>
