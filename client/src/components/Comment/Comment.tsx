import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem/CommentItem";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { currentFeedState, commentReloadState } from "../../states/atom";
import { useRecoilValue, useRecoilState } from "recoil";
import { useUserData } from "../../hooks/useUserData";
export function Comment(props: any) {
  const currentFeed = useRecoilValue(currentFeedState);
  const [cookies] = useCookies(["logCookie"]);
  const [commentList, setCommentList] = useState([]);
  const [commentReload, setcommentReload] = useRecoilState(commentReloadState);
  // 유저 데이터 가져오기
  const { data: user, isSuccess, isLoading, error } = useUserData(cookies);
  // 코멘트 변경시 리로드
  useEffect(() => {
    async function fetchData() {
      const response = await getFeedComment(currentFeed.feed_id, cookies);
      setCommentList(response.data.data);
      // console.log("코멘트 불러오기",response.data.data)
      // setcommentReload((prev) => !prev);
    }
    fetchData();
    // console.log("코멘트에서 유저", user);
  }, [commentReload]);

  return (
    <div>
      <CommentInput onFunc={props.onFunc}></CommentInput>
      <ul>
        {commentList.map((commentItem: any) => (
          <CommentItem
            onFunc={props.onFunc}
            key={commentItem.id}
            id={commentItem.id}
            content={commentItem.contents}
            writer={commentItem.nickname}
            date={commentItem.createdAt}
            profileImg={commentItem.profile_image}
            userId={user.nickname}
          ></CommentItem>
        ))}
      </ul>
    </div>
  );
}

async function getFeedComment(
  currentFeedId: number,
  cookies: { logCookie?: any }
) {
  return await axios({
    method: "get",
    url: `${process.env.REACT_APP_HOST}/api/comment/get/${currentFeedId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies.logCookie}`,
    },
  });
}
