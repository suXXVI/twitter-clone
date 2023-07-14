import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Async thunk for fetching a user's posts
export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchByUser",
  async (userId) => {
    try {
      const postsRef = collection(db, `users/${userId}/posts`);
      const querySnapshot = await getDocs(postsRef);
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log(docs);
      return docs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async ({ userId, postId }) => {
    try {
      const postRef = doc(db, `users/${userId}/posts/${postId}`);
      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        const comments = postData.comments || [];

        return { postId, comments };
      } else {
        throw new Error(`Post does not exist.`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// postSlice.js
export const removeComment = createAsyncThunk(
  "posts/removeComment", // Update the action type
  async ({ userId, postId, commentId }) => {
    // Add commentId parameter
    try {
      const postRef = doc(db, `users/${userId}/posts/${postId}`);

      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        const comments = postData.comments.filter(
          (comment) => comment.id !== commentId
        ); // Filter comments by commentId

        await setDoc(postRef, { ...postData, comments });
      }

      return { userId, postId, commentId }; // Include commentId in the returned payload
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const savePost = createAsyncThunk(
  "posts/savePost",
  async ({ userId, postContent, file }) => {
    try {
      let imageUrl = "";
      if (file !== null) {
        const imageRef = ref(storage, `posts/${file.name}`);
        const response = await uploadBytes(imageRef, file);
        imageUrl = await getDownloadURL(response.ref);
      }
      const postsRef = collection(db, `users/${userId}/posts`);
      const newPostRef = doc(postsRef);

      await setDoc(newPostRef, {
        content: postContent,
        likes: [],
        comments: [],
        imageUrl,
      });
      const newPost = await getDoc(newPostRef);

      const post = {
        id: newPost.id,
        ...newPost.data(),
      };

      return post;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ userId, postId, newPostContent, newFile }) => {
    try {
      let newImageUrl = "";

      if (newFile !== null) {
        const imageRef = ref(storage, `posts/${newFile.name}`);
        const response = await uploadBytes(imageRef, newFile);
        newImageUrl = await getDownloadURL(response.ref);
      }

      const postRef = doc(db, `users/${userId}/posts/${postId}`);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const postData = postSnap.data();
        let updatedData = {
          content: newPostContent || postData.content,
        };

        if (newFile !== null) {
          updatedData = {
            ...updatedData,
            imageUrl: newImageUrl || postData.imageUrl,
          };
        }

        await updateDoc(postRef, updatedData);

        const updatedPost = { id: postId, ...postData, ...updatedData };
        return updatedPost;
      } else {
        throw new Error("Post does not exist");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async ({ userId, postId }) => {
    try {
      const postRef = doc(db, `users/${userId}/posts/${postId}`);

      await deleteDoc(postRef);

      return postId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const saveComment = createAsyncThunk(
  "posts/saveComment",
  async ({ userId, postComment, postId }) => {
    try {
      const postRef = doc(db, `users/${userId}/posts/${postId}`);

      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        const comment = {
          text: postComment,
          userId: userId, // Include the userId in the comment object
        };
        const comments = [...postData.comments, comment];

        await setDoc(postRef, { ...postData, comments });

        const updatedPostSnap = await getDoc(postRef);
        const updatedPost = {
          id: updatedPostSnap.id,
          ...updatedPostSnap.data(),
        };

        return updatedPost;
      } else {
        throw new Error("Post does not exist.");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async ({ userId, postId }) => {
    try {
      const postRef = doc(db, `users/${userId}/posts/${postId}`);

      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        const likes = [...postData.likes, userId];

        await setDoc(postRef, { ...postData, likes });
      }

      return { userId, postId };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const removeLikeFromPost = createAsyncThunk(
  "posts/removeLikeFromPost",
  async ({ userId, postId }) => {
    try {
      const postRef = doc(db, `users/${userId}/posts/${postId}`);

      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        const likes = postData.likes.filter((id) => id !== userId);

        await setDoc(postRef, { ...postData, likes });
      }

      return { userId, postId };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// Slice
const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    comments: [],
    loading: true,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.comments[postId] = comments;
      })

      .addCase(savePost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { userId, postId } = action.payload;
        const postIndex = state.posts.findIndex((post) => post.id === postId);

        if (postIndex !== -1) {
          state.posts[postIndex].likes.push(userId);
        }
      })
      .addCase(removeLikeFromPost.fulfilled, (state, action) => {
        const { userId, postId } = action.payload;

        const postIndex = state.posts.findIndex((post) => post.id === postId);

        if (postIndex !== -1) {
          state.posts[postIndex].likes = state.posts[postIndex].likes.filter(
            (id) => id !== userId
          );
        }
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const postIndex = state.posts.findIndex(
          (post) => post.id === updatedPost.id
        );
        if (postIndex !== -1) {
          state.posts[postIndex] = updatedPost;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const deletedPostId = action.payload;
        state.posts = state.posts.filter((post) => post.id !== deletedPostId);
      });
  },
});

export default postsSlice.reducer;
