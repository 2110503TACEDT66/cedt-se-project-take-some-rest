'use client'

import { Rating } from "@mui/material"
import deleteReview from "@/libs/reviews/deleteReview";
import { useSession } from "next-auth/react";

export default function ReviewCard ({userName , rating , comment, reviewID, userID} : {userName:string,rating:number,comment:string,reviewID:string,userID:string}) {
    const { data: session } = useSession()
    const isMyReview = (session?.user._id === userID)
    const handleDelete = async () => {
        if (session){
        await deleteReview(session.user.token, reviewID)
        }
        location.reload()
    }
    return (
        <div className="w-1/3 h-44 shadow-[7px_7px_12px_#EFEFEF,-7px_-7px_12px_#F7F7F7] rounded-xl bg-white text-[#343434] flex justify-center">
            <div className="flex flex-col w-[90%] m-8">
            <div className="flex flex-row justify-between">
                <p className="font-semibold text-xl">{userName}</p>
                <Rating name={`${userName}Rating`} value={rating} readOnly></Rating>
            </div>
            <p className="block">{comment}</p>
            { isMyReview ?
                (<i className="bi bi-trash3 ml-auto mt-auto" onClick={handleDelete}></i>)
                : null
            }
            </div>
        </div>
    );
}