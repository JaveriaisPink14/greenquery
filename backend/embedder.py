# corresponds to model = SentenceTransformer('all-MiniLM-L6-v2'), model.encode(...), and torch.save(...).
# kept convert_to_tensor optional; when you saved earlier as tensor, load_embeddings_pt will load it back as
#  a tensor.

from sentence_transformers import SentenceTransformer
from typing import List
import torch
import os

_model = None

def load_model(model_name: str = None):
    """
    Load SBERT once (all-MiniLM-L6-v2 by default).
    """
    global _model
    if _model is None:
        from config import SBERT_MODEL_NAME
        model_name = model_name or SBERT_MODEL_NAME
        
        _model = SentenceTransformer(
            model_name,
            device="cpu"
        )
    return _model

def encode_texts(texts: List[str], convert_to_tensor: bool = False, show_progress: bool = True):
    """
    Encode list of texts into embeddings. By default returns numpy arrays (convert_to_tensor=False)
    which is convenient for saving as torch tensors or lists for Qdrant.
    Notebook used convert_to_tensor=True and saved torch tensor; here we keep it flexible.
    """
    model = load_model()
    embeddings = model.encode(texts, convert_to_tensor=convert_to_tensor, show_progress_bar=show_progress)
    return embeddings

def save_embeddings_pt(embeddings, path: str):
    """
    Save embeddings to path. Accepts numpy array or torch tensor.
    """
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if hasattr(embeddings, "cpu") and hasattr(embeddings, "numpy"):
        # torch tensor
        torch.save(embeddings, path)
    else:
        # convert to torch tensor then save
        t = torch.tensor(embeddings)
        torch.save(t, path)

def load_embeddings_pt(path: str):
    return torch.load(path)
