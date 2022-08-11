import * as React from "react";
import { RefObject } from "react";
import { PostInfo, RenderedPostInfo } from "uu-types";

interface useHeadingIntersectionObserverProp {
  tocListRef: React.RefObject<HTMLOListElement>;
  linkRefs: RefObject<HTMLLIElement>[];
  headingsToDisplay: RenderedPostInfo["headingsWithId"];
}

export const useHeadingIntersectionObserver = ({
  tocListRef,
  linkRefs,
  headingsToDisplay,
}: useHeadingIntersectionObserverProp) => {
  const [previousSection, setPreviousSelection] = React.useState("");

  React.useEffect(() => {
    const handleObserver: IntersectionObserverCallback = (entries) => {
      const highlightFirstActive = () => {
        if (!tocListRef.current) return;
        let firstVisibleLink =
          tocListRef.current.querySelector(".toc-is-visible");

        linkRefs.forEach((linkRef) => {
          linkRef.current!.classList.remove("toc-is-active");
        });

        if (firstVisibleLink) {
          firstVisibleLink.classList.add("toc-is-active");
        }

        if (!firstVisibleLink && previousSection) {
          tocListRef
            .current!.querySelector(`a[href="#${previousSection}"]`)!
            .parentElement!.classList.add("toc-is-active");
        }
      };

      entries.forEach((entry) => {
        let href = `#${entry.target.getAttribute("id")}`,
          link = linkRefs.find(
            (l) => l.current!.firstElementChild!.getAttribute("href") === href
          );

        if (!link || !link.current) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 1) {
          link!.current!.classList.add("toc-is-visible");
          const newPreviousSection = entry.target.getAttribute("id")!;
          setPreviousSelection(newPreviousSection);
        } else {
          link!.current!.classList.remove("toc-is-visible");
        }

        highlightFirstActive();
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "0px",
      threshold: 1,
    });

    const headingsEls = headingsToDisplay!.map((headingToDisplay) => {
      return document.getElementById(headingToDisplay.slug);
    });

    headingsEls
      .filter((a) => a)
      .forEach((heading) => {
        observer.observe(heading!);
      });

    return () => observer.disconnect();
  }, [headingsToDisplay, previousSection, linkRefs, tocListRef]);
};
