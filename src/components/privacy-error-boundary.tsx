import { Component, ErrorInfo } from "react";

export class PrivacyErrorBoundary extends Component<{}, { hasError: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn(error);
    console.warn(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <p>
          Something went wrong. This is where our Disqus comments should be. If
          you&apos;re using privacy tools, they may be blocking this comment
          system due to tracking concerns with the platform.
          <br />
          If that&apos;s the case, we&apos;d{" "}
          <a
            rel="nofollow noopener noreferrer"
            target="_blank"
            href="https://github.com/unicorn-utterances/unicorn-utterances/issues/24"
          >
            love to hear from you
          </a>{" "}
          about what type of comment system you&apos;d like to see implemented
          instead.
        </p>
      );
    }
    return this.props.children;
  }
}
