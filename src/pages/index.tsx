import Head from "next/head";
import styles from "../../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";

import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { Button, SimpleGrid, Input } from "@chakra-ui/react";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";
import { createTodo, updateTodo, deleteTodo } from "../graphql/mutations";
import { listTodos } from "../graphql/queries";
import { Todo } from "../models/index";

const images = [{ src: "/images/puyar.jpeg", width: 1, height: 1 }];

interface User {
  username: string;
  pool: unknown;
  Session: string | null;
  client: unknown;
  signInUserSession: unknown;
  authenticationFlowType: string;
  storage: { cookies: unknown; store: unknown };
  keyPrefix: string;
  userDataKey: string;
  attributes: unknown;
  preferredMFA: string;
}

const isUser = (obj: any): obj is User => {
  return obj && (obj as User).username !== undefined;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];

function Home() {
  const { data, error } = useSWR("/api/profile", fetcher);
  const [fileToBeUploaded, setFileToBeUploaded] = useState<File>();
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [todoList, setTodoList] = useState<Todo[]>([]);

  const userInfo = data && data.user;
  const user = isUser(userInfo) ? userInfo : undefined;

  const addTodo = async () => {
    try {
      await API.graphql(
        graphqlOperation(createTodo, {
          input: { name: text, description: text },
        })
      );
    } catch (error) {
      console.log("Error retrieving posts", error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files !== null && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        setFileToBeUploaded(file);
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (typeof reader.result === "string") {
            setUploadedImageSrc(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  interface Todos {
    data: {
      listTodos: {
        items: Todo[];
      };
    };
  }

  const isGraphQLResultOfTodos = (
    todos: GraphQLResult<any> | Observable<any>
  ): todos is Todos => {
    return (
      "data" in todos &&
      todos.data !== undefined &&
      "listTodos" in todos.data &&
      todos.data.listTodos !== undefined &&
      "items" in todos.data.listTodos
    );
  };

  const handleListButtonClicked = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      const todos = await API.graphql(graphqlOperation(listTodos));
      if (isGraphQLResultOfTodos(todos)) {
        const items = todos.data.listTodos.items;
        setTodoList(items);
      }
      console.log({ todos });
    } catch (error) {
      console.log({ error });
    }
  };

  const handleUploadButtonClicked = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log({ fileToBeUploaded });
    try {
      await addTodo();
      console.log("Post saved successfully!");
    } catch (error) {
      console.log("Error saving post", error);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const isValidFile = (file: File) => {
    if (ACCEPTED_IMAGE_TYPES.indexOf(file.type) === -1) {
      return false;
    }
    if (file.size > 10 * 1000 * 1000) {
      return false;
    }

    return true;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Reply Image Bucket</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Reply Image Bucket</h1>
        {error && JSON.stringify(error)}

        <div>
          {user ? (
            <button onClick={() => Auth.signOut()}>
              Sign Out {userInfo.username}
            </button>
          ) : (
            <button onClick={() => Auth.federatedSignIn()}>
              Federated Sign In
            </button>
          )}
        </div>

        {userInfo && isUser(userInfo) && (
          <div>
            {uploadedImageSrc !== "" && (
              <img style={{ width: 600 }} src={uploadedImageSrc} />
            )}
            <input type="file" onChange={handleChange} />
            <Button
              onClick={handleUploadButtonClicked}
              disabled={fileToBeUploaded === undefined}
            >
              Upload
            </Button>
            <Button onClick={handleListButtonClicked}>List</Button>
            <Input
              placeholder="Enter keywords"
              size="md"
              value={text}
              onChange={handleTextChange}
            />
            {todoList.map((todo) => {
              return <div key={todo.id}>{todo.name}</div>;
            })}
            <SimpleGrid columns={{ sm: 2, md: 3 }}>
              <Image src="/images/puyar.jpeg" width={200} height={200} />
            </SimpleGrid>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
