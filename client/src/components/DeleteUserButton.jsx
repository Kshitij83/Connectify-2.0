import React from "react";
import axios from "axios";

const DeleteUserButton = ({ userId }) => {
  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("User account deleted successfully.");
      localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("There was an error deleting your account. Please try again.");
    }
  };

  return (
    <button
      onClick={handleDeleteUser}
      style={{
        fontSize: "10px",
        padding: "2px 4px",
        border: "1px solid red",
        borderRadius: "3px",
        color: "red",
        backgroundColor: "transparent",
      }}
    >
      Delete Account
    </button>
  );
};

export default DeleteUserButton;
