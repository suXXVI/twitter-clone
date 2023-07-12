import { Button, Col, Image, Row } from "react-bootstrap";
import { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  likePost,
  removeLikeFromPost,
  deletePost,
  fetchComments,
} from "../features/posts/postsSlice";
import { AuthContext } from "./AuthProvider";
import UpdatePostModal from "./UpdatePostModal";

export default function ProfilePostCard({ post }) {
  const pic = "https://shorturl.at/twGJZ";

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleShowUpdateModal = () => setShowUpdateModal(true);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);

  const { content, id: postId, imageUrl } = post;
  const [likes, setLikes] = useState(post.likes || []);

  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.uid;

  // handling likes
  const isLiked = likes.includes(userId);
  const handleLike = () => (isLiked ? removeFromLikes() : addToLikes());

  const addToLikes = () => {
    setLikes([...likes, userId]);
    dispatch(likePost({ userId, postId }));
  };

  const removeFromLikes = () => {
    setLikes(likes.filter((id) => id !== userId));
    dispatch(removeLikeFromPost({ userId, postId }));
  };

  const handleDelete = () => {
    dispatch(deletePost({ userId, postId }));
  };

  return (
    <Row
      className='p-3'
      style={{
        borderTop: "1px solid #D3D3D3",
        borderBottom: "1px solid #D3D3D3",
      }}
    >
      <Col sm={1}>
        <Image src={pic} fluid roundedCircle />
      </Col>
      <Col>
        <strong>John Doe</strong>
        <span>@johntho Apr 16</span>
        <p>{content}</p>
        <Image src={imageUrl} style={{ width: 150 }} />
        <div className='d-flex justify-content-between'>
          <Button variant='light'>
            <i className='bi bi-chat'></i>
          </Button>
          <Button variant='light'>
            <i className='bi bi-repeat'></i>
          </Button>
          <Button variant='light' onClick={handleLike}>
            {isLiked ? (
              <i
                className='bi bi-heart-fill text-danger'
                style={{ marginRight: "10px" }}
              ></i>
            ) : (
              <i className='bi bi-heart' style={{ marginRight: "10px" }}></i>
            )}
            {likes.length}
          </Button>
          <Button variant='light'>
            <i
              className='bi bi-pencil-square'
              onClick={handleShowUpdateModal}
            ></i>
          </Button>
          <Button variant='light'>
            <i className='bi bi-trash' onClick={handleDelete}></i>
          </Button>
          <UpdatePostModal
            show={showUpdateModal}
            handleClose={handleCloseUpdateModal}
            postId={postId}
            originalPostContent={content}
          />
        </div>
        {/* {comments.map((comment) => (
          <p key={comment.id}>{comment.content}</p>
        ))} */}
      </Col>
    </Row>
  );
}
