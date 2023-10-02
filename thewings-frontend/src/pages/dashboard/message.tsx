import { ReactElement } from "react";
import { DashboardLayout } from "../../layout";
import { Stack } from "@mui/material";
import Search from "../../components/layout/Header/Search";
import SendIcon from "@mui/icons-material/Send";
import Avatar from "@mui/material/Avatar";

const Message = () => {
  return (
    <Stack
      flex={1}
      bgcolor="#15161661"
      justifyContent="center"
      alignItems="center"
    >
      <div className="grid grid-cols-4 h-full w-full box-border">
        <div className="h-full bg-[#333b5638] col-span-1 w-full p-3">
          <h1 className="p-3 text-center text-2xl font-serif font-bold text-white ">
            Message
          </h1>
          <Search justifyContent="space-between" className="relative" />
        </div>
        <div className="h-full w-full bg-[#1e1e1ecf] col-span-3 relative">
          <form>
            <header className="w-full flex items-center bg-slate-700 shadow-md ">
              <Avatar alt="Name" className="m-2 bg-white w-[40px] h-[40px]" />
              <div className="flex flex-col ml-2">
                <h1 className="text-white font-bold">Name</h1>
                <p className="text-white font-light">Online</p>
              </div>
            </header>
            <footer className="absolute bottom-0 w-full p-3 box-border">
              <div className="w-full h-[40px] flex items-center justify-center">
                <input
                  type="text"
                  className="w-[95%] text-black pl-3 rounded-3xl h-full"
                  placeholder="Type a message..."
                />
                <SendIcon className="ml-2 w-[35px] h-[35px] text-blue-200" />
              </div>
            </footer>
          </form>
        </div>
      </div>
    </Stack>
  );
};

export default Message;

Message.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
