// client/src/blog/components/PostCard.js
import React from "react";
import { Link } from "react-router-dom";
import "../blog.css";

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <Link to={`/blog/${post.slug}`} className="post-card-link">
        <div className="post-image-container">
          <img src={post.image} alt={post.title} className="post-image" loading="lazy"  />
        </div>
        <div className="post-content">
          <p className="post-date">{post.date}</p>
          <h3 className="post-title">{post.title}</h3>
          <p className="post-excerpt">{post.excerpt}</p>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
