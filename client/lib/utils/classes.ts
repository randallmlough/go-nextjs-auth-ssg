import { classNames } from "@/utils/classnames";
import { BgColor } from "@/enums/styles";

interface variantOptions {
  isFullPage: boolean;
  bgColor: BgColor;
}

interface HtmlBodyClasses {
  htmlClasses: string;
  bodyClasses: string;
}
export default function HtmlBodyClasses(
  variants: variantOptions
): HtmlBodyClasses {
  const { isFullPage, bgColor } = variants;
  let htmlClasses = classNames(isFullPage && "h-full");
  let bodyClasses = classNames(
    bgColor ?? "bg-gray-100",
    isFullPage && "h-full"
  );
  return {
    htmlClasses,
    bodyClasses,
  };
}
