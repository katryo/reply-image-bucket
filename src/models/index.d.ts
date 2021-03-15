import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Image {
  readonly id: string;
  readonly keywords: Keyword[];
  readonly fileName: string;
  readonly fileExtension: string;
  readonly userSub: string;
  readonly key: string;
  constructor(init: ModelInit<Image>);
  static copyOf(source: Image, mutator: (draft: MutableModel<Image>) => MutableModel<Image> | void): Image;
}

export declare class Keyword {
  readonly id: string;
  readonly text: string;
  readonly image: Image;
  constructor(init: ModelInit<Keyword>);
  static copyOf(source: Keyword, mutator: (draft: MutableModel<Keyword>) => MutableModel<Keyword> | void): Keyword;
}