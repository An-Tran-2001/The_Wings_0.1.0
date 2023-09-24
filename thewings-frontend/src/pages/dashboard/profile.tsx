import Button from "components/Button";

const Page = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="container">
                <form>
                    <header className="">
                        <div className="relative h-96 bg-neutral-950 rounded m-3">
                            <div className="flex items-end absolute translate-y-1/2 translate-x-1/2 bottom-0 left-0">
                                <div className="w-[150px] h-[150px] bg-neutral-950 rounded-full outline-black outline-[5px] outline">
                                </div>
                                <h1 className="text-white font-bold text-[20px]">Name</h1>
                            </div>
                        </div>
                        <div className="flex items-center justify-end h-[100px] border-b-[1px]  border-stone-500">
                            <div className="flex ">
                                <Button content="Message" />
                                <Button content="Add Friend" />
                                <Button content="Edit Profile" />
                            </div>
                        </div>
                        <div className="h-[100px] border-b-1 border-white">
                        </div>
                    </header>
                </form>
            </div>
        </div>
    );
};
export default Page;