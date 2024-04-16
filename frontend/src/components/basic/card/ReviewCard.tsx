'use client'

import { Rating } from "@mui/material"
import deleteReview from "@/libs/reviews/deleteReview";
import { useSession } from "next-auth/react";

export default function ReviewCard ({
    review
} : {
    review: reviewItem
}) {
    const { data: session } = useSession()
    const isMyReview = (session?.user._id === review.user._id)
    const handleDelete = async () => {
        if (session){
            await deleteReview(session.user.token, review._id)
        }
        location.reload()
    }
    return (
        <div className="w-full h-44 shadow-[7px_7px_12px_#EFEFEF,-7px_-7px_12px_#F7F7F7] rounded-xl bg-white text-[#343434] flex justify-center">
            <div className="flex flex-col w-[90%] m-8">
            <div className="flex flex-row justify-between">
                <p className="font-semibold text-xl">{review.user.name}</p>
                <Rating name={`${review.user.name}Rating`} value={review.score} readOnly></Rating>
            </div>
            <p className="block">{review.comment}</p>
            { isMyReview ?
                (<i className="bi bi-trash3 ml-auto mt-auto" onClick={handleDelete}></i>)
                : null
            }
            </div>
        </div>
    );
}