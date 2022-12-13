import React from "react";
import cn from "classnames";
import Link from "next/link";

type HtmlButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
type LinkProps = React.PropsWithChildren<{ href: string; className?: string }>;

type BaseButtonProps = HtmlButtonProps | LinkProps;

const isLinkProps = (props: any): props is LinkProps => !!props.href;

const ButtonBase: React.FC<BaseButtonProps> = (props) => {
  const className = cn(
    "text-center text-lg font-semibold rounded-lg w-full p-3 hover:underline",
    props.className
  );

  return isLinkProps(props) ? (
    <Link {...props} className={className} />
  ) : (
    <button {...props} className={className} />
  );
};

const DefaultButton: React.FC<BaseButtonProps> = (props) => (
  <ButtonBase
    {...props}
    className={cn("border-2 border-front", props.className)}
  />
);

const Highlight1Button: React.FC<BaseButtonProps> = (props) => (
  <ButtonBase
    {...props}
    className={cn(
      "bg-gradient-to-r from-highlight1-offset to-highlight1-offset via-highlight1 text-back",
      props.className
    )}
  />
);

const Highlight2Button: React.FC<BaseButtonProps> = (props) => (
  <ButtonBase
    {...props}
    className={cn(
      "bg-gradient-to-r from-highlight2-offset to-highlight2-offset via-highlight2",
      props.className
    )}
  />
);

const HighlightMixButton: React.FC<BaseButtonProps> = (props) => (
  <ButtonBase
    {...props}
    className={cn(
      // "bg-gradient-to-r from-highlight2 to-highlight1",
      "bg-falloff-highlight-mix",
      props.className
    )}
  />
);

export type ButtonProps = BaseButtonProps & { look?: number };

export const Button: React.FC<ButtonProps> = ({ look, ...props }) => {
  switch (look) {
    case 1:
      return <Highlight1Button {...props} />;
    case 2:
      return <Highlight2Button {...props} />;
    case 3:
      return <HighlightMixButton {...props} />;
    default:
      return <DefaultButton {...props} />;
  }
};
