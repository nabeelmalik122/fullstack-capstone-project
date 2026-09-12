import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './DetailsPage.css';

function DetailsPage() {
    const { productId } = useParams();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const authenticationToken = sessionStorage.getItem('auth-token');
        if (!authenticationToken) {
            navigate('/app/login');
        }

        // Fetch gift details
        const fetchGift = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${productId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGift(data);
                setComments(data.comments || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGift();
    }, [productId, navigate]);

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) return <div className="container mt-5">Loading...</div>;
    if (error) return <div className="container mt-5">Error: {error}</div>;
    if (!gift) return <div className="container mt-5">Gift not found</div>;

    return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-3" onClick={handleBack}>
                Back
            </button>
            <div className="card product-details-card">
                <div className="card-header bg-primary text-white">
                    <h2 className="details-title">{gift.name}</h2>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            {gift.image ? (
                                <img src={gift.image} alt={gift.name} className="img-fluid rounded" />
                            ) : (
                                <div className="no-image-available">No Image Available</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <h4 className="gift-category">Category: {gift.category}</h4>
                            <p className="gift-condition">Condition: {gift.condition}</p>
                            <p className="gift-date">Date Added: {new Date(gift.date_added * 1000).toLocaleDateString()}</p>
                            <p className="gift-description">{gift.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="comments-section mt-4">
                <h3>Comments</h3>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="card mb-3">
                            <div className="card-body">
                                <h6 className="card-subtitle mb-2 text-muted">{comment.author}</h6>
                                <p className="card-text">{comment.comment}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No comments yet.</p>
                )}
            </div>
        </div>
    );
}

export default DetailsPage;
