use mermaid_rs_renderer::{LayoutConfig, RenderOptions, Theme};
use std::sync::LazyLock;

const MERMAID_GIT_COLORS: [&str; 8] = [
    "var(--primary_default)",
    "var(--primary_variant)",
    "var(--secondary_default)",
    "var(--secondary_variant)",
    "var(--error_default)",
    "var(--error_variant)",
    "var(--positive_default)",
    "var(--positive_variant)",
];

const MERMAID_GIT_INV_COLORS: [&str; 8] = [
    "var(--background_primary)",
    "var(--background_primary)",
    "var(--background_primary)",
    "var(--background_primary)",
    "var(--background_primary)",
    "var(--background_primary)",
    "var(--background_primary)",
    "var(--background_primary)",
];

const MERMAID_GIT_BRANCH_LABEL_COLORS: [&str; 8] = [
    "var(--primary_on-default)",
    "var(--primary_on-variant)",
    "var(--secondary_on-default)",
    "var(--secondary_on-variant)",
    "var(--error_on-default)",
    "var(--error_on-variant)",
    "var(--positive_on-default)",
    "var(--positive_on-variant)",
];

const PRIMARY_COLOR: &str = "var(--opaque-surface_primary_emphasis-low)";
const SECONDARY_COLOR: &str = "var(--opaque-surface_primary_emphasis-medium)";
const TERTIARY_COLOR: &str = "var(--opaque-surface_primary_emphasis-high)";

const MERMAID_PIE_CHART_COLORS: [&str; 12] = [
    PRIMARY_COLOR,
    SECONDARY_COLOR,
    TERTIARY_COLOR,
    PRIMARY_COLOR,
    SECONDARY_COLOR,
    TERTIARY_COLOR,
    PRIMARY_COLOR,
    SECONDARY_COLOR,
    TERTIARY_COLOR,
    PRIMARY_COLOR,
    SECONDARY_COLOR,
    TERTIARY_COLOR,
];

static THEME: LazyLock<Theme> = LazyLock::new(|| Theme {
    font_family: "Figtree, Arial, Roboto, sans-serif".to_string(),
    font_size: 14.0,
    primary_color: PRIMARY_COLOR.to_string(),
    primary_text_color: "var(--foreground_emphasis-high)".to_string(),
    primary_border_color: "var(--background_disabled)".to_string(),
    line_color: "var(--foreground_emphasis-high)".to_string(),
    secondary_color: SECONDARY_COLOR.to_string(),
    tertiary_color: TERTIARY_COLOR.to_string(),
    edge_label_background: "var(--background_primary-bright)".to_string(),
    cluster_background: "var(--background_primary-bright)".to_string(),
    cluster_border: "var(--background_disabled)".to_string(),
    background: "transparent".to_string(),
    sequence_actor_fill: PRIMARY_COLOR.to_string(),
    sequence_actor_border: "var(--background_disabled)".to_string(),
    sequence_actor_line: "var(--foreground_emphasis-high)".to_string(),
    sequence_note_fill: "var(--background_primary-bright)".to_string(),
    sequence_note_border: "var(--secondary_default)".to_string(),
    sequence_activation_fill: "var(--surface_secondary_emphasis-low)".to_string(),
    sequence_activation_border: "var(--surface_secondary_emphasis-high)".to_string(),
    text_color: "var(--foreground_emphasis-high)".to_string(),
    git_colors: MERMAID_GIT_COLORS.map(|value| value.to_string()),
    git_inv_colors: MERMAID_GIT_INV_COLORS.map(|value| value.to_string()),
    git_branch_label_colors: MERMAID_GIT_BRANCH_LABEL_COLORS.map(|value| value.to_string()),
    git_commit_label_color: "var(--foreground_emphasis-high)".to_string(),
    git_commit_label_background: "var(--background_primary-bright)".to_string(),
    git_tag_label_color: "var(--foreground_emphasis-high)".to_string(),
    git_tag_label_background: "var(--background_primary-bright)".to_string(),
    git_tag_label_border: "var(--background_disabled)".to_string(),
    pie_colors: MERMAID_PIE_CHART_COLORS.map(|value| value.to_string()),
    pie_title_text_size: 25.0,
    pie_title_text_color: "var(--foreground_emphasis-high)".to_string(),
    pie_section_text_size: 17.0,
    pie_section_text_color: "var(--foreground_emphasis-high)".to_string(),
    pie_legend_text_size: 17.0,
    pie_legend_text_color: "var(--foreground_emphasis-medium)".to_string(),
    pie_stroke_color: "var(--background_disabled)".to_string(),
    pie_stroke_width: 1.6,
    pie_outer_stroke_width: 1.6,
    pie_outer_stroke_color: "var(--background_disabled)".to_string(),
    pie_opacity: 0.85,
});

static RENDER_OPTIONS: LazyLock<RenderOptions> = LazyLock::new(|| RenderOptions {
    theme: THEME.clone(),
    layout: LayoutConfig::default(),
});

#[neon::export]
fn render_mermaid(document: String) -> String {
    mermaid_rs_renderer::render_with_options(&document, RENDER_OPTIONS.clone()).unwrap()
}
