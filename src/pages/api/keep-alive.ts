import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message?: string;
  key?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve("done!");
    }, 1500);
  });
  return promise.then(() => {
    return res.status(200).json({ key: new Date().getTime().toString(36) });
  });
}
