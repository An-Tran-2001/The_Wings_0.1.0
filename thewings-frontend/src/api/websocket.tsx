import { TOKEN_KEY } from "constant/path";

export const requestOptions = {
    headers: {
      token: localStorage.getItem(TOKEN_KEY),
    },
  };