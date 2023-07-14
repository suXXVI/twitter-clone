import { useState, useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";
// import { useDispatch, useEffect, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useEffect } from "react";
import {
  saveComment,
  fetchComments,
  removeComment,
} from "../features/posts/postsSlice";
import { AuthContext } from "./AuthProvider";

export default function CommentModal({ show, handleClose, postId }) {
  const [postComment, setPostComment] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.uid;

  const comments = useSelector((state) => state.posts.comments[postId]);

  useEffect(() => {
    if (show) {
      dispatch(fetchComments({ userId, postId }));
    }
  }, [dispatch, postId, show, userId]);

  const handleSave = () => {
    dispatch(saveComment({ userId, postComment, postId }));
    handleClose();
    setPostComment("");
  };

  const handleDelete = (commentId) => {
    dispatch(removeComment({ userId, postId, commentId }));
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {/* Display the comments */}
          {comments &&
            comments.map((comment, index) => (
              <div key={index}>
                <p>{comment.text}</p>
                <p>Posted by: {comment.userId}</p>
                <button onClick={() => handleDelete(comment.id)}>Delete</button>
              </div>
            ))}
          <Form>
            <Form.Group controlId='postContent'>
              <Form.Control
                placeholder='Add new comment.'
                as='textarea'
                rows={3}
                onChange={(e) => setPostComment(e.target.value)}
              />
              <br />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='primary'
            className='rounded-pill'
            onClick={handleSave}
          >
            Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
