import { Button } from "flowbite-react";
import { HiOutlineViewGrid } from "react-icons/hi";
import { HiOutlineListBullet } from "react-icons/hi2";

type Props = {
  isList: boolean;
  setIsList: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ViewAsBtn({ isList, setIsList }: Props) {
  return (
    <Button
      color="alternative"
      className="h-auto w-[48px] p-0"
      title={`View as ${isList ? "List" : "Grid"}`}
      onClick={() => setIsList((prevState) => !prevState)}
    >
      {isList ? (
        <HiOutlineListBullet size={24} />
      ) : (
        <HiOutlineViewGrid size={24} />
      )}
    </Button>
  );
}
