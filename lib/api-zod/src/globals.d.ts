declare var File: {
  new (
    fileBits: BlobPart[],
    fileName: string,
    options?: FilePropertyBag,
  ): File;
  prototype: File;
};

declare var Blob: {
  new (blobParts?: BlobPart[], options?: BlobPropertyBag): Blob;
  prototype: Blob;
};

interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
  readonly webkitRelativePath: string;
}

interface Blob {
  readonly size: number;
  readonly type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
  slice(start?: number, end?: number, contentType?: string): Blob;
  stream(): ReadableStream;
  text(): Promise<string>;
}

type BlobPart = BufferSource | Blob | string;

interface BlobPropertyBag {
  type?: string;
  endings?: "transparent" | "native";
}

interface FilePropertyBag extends BlobPropertyBag {
  lastModified?: number;
}

type BufferSource = ArrayBufferView | ArrayBuffer;
