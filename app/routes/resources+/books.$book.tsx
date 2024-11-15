import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { Prose } from "~/components/prose";
import { Tags } from "~/components/ui/tags";
import { books } from "~/data/books";
import { notFound } from "~/utils/notfound";

export const meta: MetaFunction = () => {
  return [
    { title: "Books for Christian Entrepreneurs" },
    { description: "Books for Christian Entrepreneurs." },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const book = books.find((book) => book.slug === params.book);
  if (!book) {
    throw notFound();
  }
  const content = await bundleMDX({
    source: book.longDescription,
  });
  return json({ book, content });
};

export default function Book() {
  const { book, content } = useLoaderData<typeof loader>();
  const Content = useMemo(() => getMDXComponent(content.code), [content.code]);
  return (
    <Prose className="mx-auto max-w-4xl py-10">
      <div className="flex flex-row gap-10">
        <img
          src={book.imageUrl}
          alt={book.title}
          className="m-0 object-cover max-w-sm max-h-sm"
        />
        <div className="flex flex-col gap-4 flex-grow">
          <h1 className="m-0">
            <Link
              to={`/resources/books`}
              className="no-underline hover:underline font-bold"
            >
              Books
            </Link>{" "}
            / {book.title}
          </h1>
          <h2 className="m-0">{book.description}</h2>
          <div className="flex flex-row gap-2 justify-between">
            <Link to={book.link} className="text-body-xs">
              Buy on Amazon
            </Link>
            <Tags tags={book.tags} />
          </div>
          <div>
            <Content />
          </div>
        </div>
      </div>
    </Prose>
  );
}
