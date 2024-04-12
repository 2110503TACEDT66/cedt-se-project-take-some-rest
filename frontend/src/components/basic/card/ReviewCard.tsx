import { Rating } from "@mui/material";

export default function ReviewCard ({userName , rating , comment} : {userName:string,rating:number,comment:string}) {
    return (
        <div className="w-1/3 h-44 shadow-[7px_7px_12px_#EFEFEF,-7px_-7px_12px_#F7F7F7] rounded-xl bg-white text-[#343434] flex justify-center">
            <div className="flex flex-col w-[90%] m-8">
            <div className="flex flex-row justify-between">
                <p className="font-semibold text-xl">{userName}</p>
                <Rating name={`${userName}Rating`} value={rating} readOnly></Rating>
            </div>
            <p className="block">{comment}</p>
            <i className="bi bi-trash3 ml-auto mt-auto"></i>
            </div>
        </div>
    );
}