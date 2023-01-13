import FeedItem from "./FeedItem/FeedItem";
import { useEffect, useState } from "react";
// import { useRecoilState, useRecoilValue } from "recoil";
// import {
//   groupFeedListState,
//   userInfoState,
//   tagModalVisble,
// } from "../../states/atom";
import { useCookies } from "react-cookie";
// import { useEffect } from "react";
import axios from "axios";
import { DocumentIcon, MegaphoneIcon } from "@heroicons/react/24/outline";
// import { TagEditModal } from "../Tags/TagEditModal";
import { QueryCache, useQuery, QueryClient, useQueryClient } from "react-query";
import { useInView } from "react-intersection-observer";
import { useInfiniteFeed } from "./useInfiniteFeed";
const AvailableFeeds = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const { getBoard, getNextPage, getBoardIsSuccess, getNextPageIsPossible } =
    useInfiniteFeed();
  const [ref, isView] = useInView();

  useEffect(() => {
    // 맨 마지막 요소를 보고있고 더이상 페이지가 존재하면
    // 다음 페이지 데이터를 가져옴
    if (isView && getNextPageIsPossible) {
      getNextPage();
    }
  }, [isView, getBoard]);
  // const { data: feedsInGroup, isSuccess } = useQuery(
  //   "feedsInGroup",
  //   async () => {
  //     const response = await axios({
  //       method: "get",
  //       url: `${process.env.REACT_APP_HOST}/api/feed/group/${groupId}`,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${cookies.logCookie}`,
  //       },
  //     });
  //     console.log(response.data.data);
  //     return response.data.data;
  //   },
  //   {
  //     enabled: groupId !== undefined,
  //   }
  // );
  // const {
  //   data: feedsInGroup,
  //   hasNextPage,
  //   fetchNextPage,
  //   isFetchingNextPage,
  // } = useInfiniteQuery(
  //   "feedsInGroup",
  //   async ({ pageParam = 1 }) => {
  //     const response = await axios({
  //       method: "get",
  //       url: `${
  //         process.env.REACT_APP_HOST
  //       }/api/feed/sep/feed?page=${pageParam}&take=${5}`,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${cookies.logCookie}`,
  //       },
  //     });
  //     console.log(response.data.data);
  //     return response.data.data;
  //   },
  //   {
  //     enabled: groupId !== undefined,
  //     getNextPageParam: (lastPage: [], pages: []) => {
  //       if (lastPage.length < 5) {
  //         return undefined;
  //       }
  //       return pages.length;
  //     },
  //   }
  // );

  return (
    <div className="overflow-auto basis-2/4">
      {/* 위에 여백 두고 그룹피드 타이틀 만들기 */}
      {/* 그룹 피드 타이틀 ver1*/}
      {/* <div className="relative p-3 rounded-3xl">
        <h1 className="text-2xl antialiased font-bold text-whtie">그룹 피드</h1>
      </div> */}
      {/* 그룹 피드 타이틀 ver2 */}
      <div className="rounded-lg bg-sky-500">
        <div className="px-3 py-3 mx-auto rounded-lg max-w-7xl">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center flex-1 w-0 ">
              <span className="flex p-2 mr-1 -ml-3 rounded-lg bg-sky-500">
                <DocumentIcon
                  className="w-6 h-6 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="text-xl font-bold text-white truncate">
                <span className="md:hidden">그룹 피드</span>
                <span className="hidden md:inline">그룹 피드</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* feedslist section */}
      <div className="mt-5 ">
        <ul className="">
          {
            // 데이터를 불러오는데 성공하고 데이터가 0개가 아닐 때 렌더링
            getBoardIsSuccess && getBoard!.pages
              ? getBoard!.pages.map((page_data, page_num) => {
                  const board_page = page_data.board_page;
                  console.log("피드 리스트", board_page, page_num);
                  return board_page.map((feed: any, idx: any) => {
                    if (
                      // 마지막 요소에 ref 달아주기
                      getBoard!.pages.length - 1 === page_num &&
                      board_page.length - 1 === idx
                    ) {
                      return (
                        // 마지막 요소에 ref 넣기 위해 div로 감싸기
                        <div ref={ref} key={feed.board_id} className="mb-4">
                          <FeedItem
                            id={feed.id}
                            key={feed.id}
                            title={feed.title}
                            description={feed.og.description}
                            og_image={feed.og.image}
                            url={feed.url}
                            highlight={feed.highlight}
                            date={feed.createdAt}
                            tag={feed.tag}
                            writer={feed.user.nickname}
                            writerImg={feed.user.image}
                            commentLen={feed.comment.length}
                            bookmarked={
                              feed.bookmark.length !== 0 ? true : false
                            }
                            bookmarkId={feed.bookmark[0]}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={feed.board_id} className="mb-4">
                          <FeedItem
                            id={feed.id}
                            key={feed.id}
                            title={feed.title}
                            description={feed.og.description}
                            og_image={feed.og.image}
                            url={feed.url}
                            highlight={feed.highlight}
                            date={feed.createdAt}
                            tag={feed.tag}
                            writer={feed.user.nickname}
                            writerImg={feed.user.image}
                            commentLen={feed.comment.length}
                            bookmarked={
                              feed.bookmark.length !== 0 ? true : false
                            }
                            bookmarkId={feed.bookmark[0]}
                          />
                        </div>
                      );
                    }
                  });
                })
              : null
          }
          {/* {feedsInGroup &&
            feedsInGroup.map((feed: any) => (
              <div key={feed.id} className="mb-4">
                <FeedItem
                  id={feed.id}
                  key={feed.id}
                  title={feed.title}
                  description={feed.og.description}
                  og_image={feed.og.image}
                  url={feed.url}
                  highlight={feed.highlight}
                  date={feed.createdAt}
                  tag={feed.tag}
                  writer={feed.user.nickname}
                  writerImg={feed.user.image}
                  commentLen={feed.comment.length}
                  bookmarked={feed.bookmark.length !== 0 ? true : false}
                  bookmarkId={feed.bookmark[0]}
                />
              </div>
            ))} */}
        </ul>
      </div>
      {/* {tagModal && <TagEditModal></TagEditModal>} */}
      {/* 토글 버튼 느낌으로 댓글 기능 */}
      <div className="fixed bottom-0 right-0 z-10">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          // onClick={() => setTagModal(true)}
        >
          <MegaphoneIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
          <span>피드 추가</span>
        </button>
      </div>
    </div>
  );
};

export default AvailableFeeds;

function getUserData() {
  return;
}
