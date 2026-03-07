"use client";

import Iconify from "./Iconify";

interface Props {
  title: string;
  description: string;
  imageSrc?: string;
}

export default function PageHeader({ title, description, imageSrc }: Props) {
  return (
    <div
      className="bg-card p-4 pb-0 lg:pr-0 lg:pt-5 flex items-center rounded-xl border shadow mb-4 bg-no-repeat bg-cover h-[169px]"
      style={{
        backgroundImage: imageSrc ? `url("${imageSrc}")` : "none",
      }}
    >
      <div className="p-3 lg:p-5 lg:pt-3">
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-primary">
          {title}
        </h1>
        <p
          className="text-lg leading-relaxed font-normal mt-2 text-primary"
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>
      </div>
    </div>
  );
}
