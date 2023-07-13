import { useState, useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { saveComment } from "../features/posts/postsSlice";
import { AuthContext } from "./AuthProvider";

export default function CommentModal({ show, handleClose, postId }) {
  const [postComment, setPostComment] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.uid;

  const handleSave = () => {
    dispatch(saveComment({ userId, postComment, postId }));
    handleClose();
    setPostComment("");
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
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
