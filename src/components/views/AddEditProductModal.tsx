import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { 
  Product, 
  CategoryType, 
  PriceType, 
  Condition, 
  Gender, 
  AgeGroup, 
  AvailabilityStatus, 
  User 
} from '../../types';
import { CATEGORIES } from '../../data/categories';
import { ALL_STATE_NAMES, getCitiesForState } from '../../data/locations';
import { marketplaceStore } from '../../services/marketplaceStore';

// Preset sample images for quick selection if user does not have a local photo handy
import ankaraFabricImg from '../../assets/images/product_ankara_fabric_1790923377111.jpg';
import mensSenatorImg from '../../assets/images/product_mens_senator_1790923392010.jpg';
import leatherBagImg from '../../assets/images/product_leather_bag_1790923547727.jpg';
import womensLaceImg from '../../assets/images/product_womens_lace_1790923563164.jpg';

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  productToEdit?: Product | null;
  onSuccess: (product: Product) => void;
}

const PRESET_SAMPLE_PHOTOS = [
  { name: 'Ankara Wax Fabric', url: ankaraFabricImg },
  { name: "Men's Senator Suit", url: mensSenatorImg },
  { name: 'Artisan Leather Bag', url: leatherBagImg },
  { name: "Women's Lace Dress", url: womensLaceImg },
  { name: 'Casual Footwear', url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80' },
  { name: 'School Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80' }
];

export const AddEditProductModal: React.FC<AddEditProductModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  productToEdit,
  onSuccess
}) => {
  const isEditing = Boolean(productToEdit);

  // Form states
  const [name, setName] = useState(productToEdit?.name || '');
  const [category, setCategory] = useState<CategoryType>(productToEdit?.category || 'Fashion Materials');
  const [subcategory, setSubcategory] = useState(
    productToEdit?.subcategory || CATEGORIES[0].subcategories[0]
  );
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [price, setPrice] = useState<number | ''>(productToEdit?.price || '');
  const [priceType, setPriceType] = useState<PriceType>(productToEdit?.priceType || 'Fixed price');
  const [quantity, setQuantity] = useState<number | ''>(productToEdit?.quantity || 1);
  const [condition, setCondition] = useState<Condition>(productToEdit?.condition || 'New');
  const [gender, setGender] = useState<Gender>(productToEdit?.gender || 'Unisex');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(productToEdit?.ageGroup || 'Adult');
  const [size, setSize] = useState(productToEdit?.size || '');
  const [color, setColor] = useState(productToEdit?.color || '');
  const [material, setMaterial] = useState(productToEdit?.material || '');
  const [brand, setBrand] = useState(productToEdit?.brand || '');
  const [state, setState] = useState(productToEdit?.state || currentUser.state || 'Lagos');
  const [city, setCity] = useState(productToEdit?.city || currentUser.city || 'Ikeja');
  const [phone, setPhone] = useState(productToEdit?.sellerPhone || currentUser.phoneNumber || '');
  const [whatsapp, setWhatsapp] = useState(productToEdit?.sellerWhatsApp || currentUser.phoneNumber || '');
  const [deliveryAvailable, setDeliveryAvailable] = useState<boolean>(
    productToEdit ? productToEdit.deliveryAvailable : true
  );
  const [availability, setAvailability] = useState<AvailabilityStatus>(
    productToEdit?.availability || 'In Stock'
  );
  
  // Images
  const [images, setImages] = useState<string[]>(
    productToEdit?.images && productToEdit.images.length > 0 ? productToEdit.images : [ankaraFabricImg]
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const currentCategoryDef = CATEGORIES.find(c => c.name === category) || CATEGORIES[0];

  const handleCategoryChange = (newCat: CategoryType) => {
    setCategory(newCat);
    const def = CATEGORIES.find(c => c.name === newCat);
    if (def && def.subcategories.length > 0) {
      setSubcategory(def.subcategories[0]);
    }
  };

  const handleStateChange = (newState: string) => {
    setState(newState);
    const cities = getCitiesForState(newState);
    setCity(cities[0] || 'Center');
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!name.trim()) {
      setError('Please provide a product title.');
      setLoading(false);
      return;
    }

    if (typeof price !== 'number' || price <= 0) {
      setError('Please enter a valid price in Nigerian Naira (₦).');
      setLoading(false);
      return;
    }

    if (images.length === 0) {
      setError('Please add at least one product image.');
      setLoading(false);
      return;
    }

    try {
      const sellerProfile = marketplaceStore.getSellerById(currentUser.id);
      const isSellerVerified = sellerProfile?.isVerified || currentUser.accountType === 'Admin';

      if (isEditing && productToEdit) {
        const updated = marketplaceStore.updateProduct(productToEdit.id, {
          name: name.trim(),
          category,
          subcategory,
          description: description.trim(),
          price: Number(price),
          priceType,
          quantity: typeof quantity === 'number' ? quantity : 1,
          condition,
          gender,
          ageGroup,
          size: size.trim(),
          color: color.trim(),
          material: material.trim(),
          brand: brand.trim(),
          state,
          city,
          sellerPhone: phone.trim(),
          sellerWhatsApp: whatsapp.trim(),
          deliveryAvailable,
          availability,
          images
        });

        if (updated) {
          onSuccess(updated);
          onClose();
        } else {
          setError('Failed to update product.');
        }
      } else {
        const newProduct = marketplaceStore.createProduct({
          sellerId: currentUser.id,
          sellerName: currentUser.fullName,
          sellerBusinessName: currentUser.businessName || `${currentUser.fullName}'s Shop`,
          sellerPhone: phone.trim() || currentUser.phoneNumber,
          sellerWhatsApp: whatsapp.trim() || currentUser.phoneNumber,
          isSellerVerified,
          name: name.trim(),
          category,
          subcategory,
          description: description.trim(),
          price: Number(price),
          priceType,
          quantity: typeof quantity === 'number' ? quantity : 1,
          condition,
          gender,
          ageGroup,
          size: size.trim(),
          color: color.trim(),
          material: material.trim(),
          brand: brand.trim(),
          state,
          city,
          deliveryAvailable,
          availability,
          images,
          isSampleListing: false
        });

        onSuccess(newProduct);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the product listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 text-left max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#047857] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider block">
              GERALD FASHION HUB · SELLER WORKFLOW
            </span>
            <h3 className="text-xl font-bold font-serif text-white mt-0.5">
              {isEditing ? 'Edit Product Listing' : 'List New Product / Material for Sale'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-emerald-100 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                1. Product Title & Classification
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product / Fabric Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Dutch Wax Ankara (6 Yards) or Men's Senator Wear"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#047857]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Main Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as CategoryType)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#047857]"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subcategory *
                  </label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#047857]"
                  >
                    {currentCategoryDef.subcategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe material composition, texture, weave, measurements, origin, washing instructions, and special features..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#047857]"
                />
              </div>
            </div>

            {/* Section 2: Pricing & Inventory */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                2. Price in Nigerian Naira (₦) & Stock
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price (in ₦) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">₦</span>
                    <input
                      type="number"
                      required
                      min={100}
                      step={50}
                      value={price}
                      onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 8500"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#047857] font-semibold tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price Type *
                  </label>
                  <select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value as PriceType)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#047857]"
                  >
                    <option value="Fixed price">Fixed price</option>
                    <option value="Negotiable">Negotiable</option>
                    <option value="Price per yard">Price per yard</option>
                    <option value="Price per piece">Price per piece</option>
                    <option value="Price per bundle">Price per bundle</option>
                    <option value="Price per pair">Price per pair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity Available *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#047857] tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Condition *
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as Condition)}
                    className="w-full py-2 px-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="New">Brand New</option>
                    <option value="Used">Used / Pre-owned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full py-2 px-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age Group *
                  </label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                    className="w-full py-2 px-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Adult">Adult</option>
                    <option value="Children">Children</option>
                    <option value="Teen">Teen</option>
                    <option value="Baby">Baby</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Availability Status *
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as AvailabilityStatus)}
                    className="w-full py-2 px-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Attributes (Size, Material, Color, Brand) */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                3. Fabric & Sizing Details
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Size / Dimension
                  </label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. 6 Yards or XL"
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Color(s)
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Navy & Gold"
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Material / Fabric
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="e.g. 100% Cotton, Wool"
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Brand / Label
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Dutch Wax / Bespoke"
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Nigerian Location System per Requirement 6 */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                4. Location & Contact
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State (All 36 States + FCT Abuja) *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    {ALL_STATE_NAMES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Commercial Hub *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    {getCitiesForState(state).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phone Number for Inquiries *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0803 123 4567"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    WhatsApp Number for Orders *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. 0803 123 4567"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="delivery-available"
                  checked={deliveryAvailable}
                  onChange={(e) => setDeliveryAvailable(e.target.checked)}
                  className="rounded text-[#047857] focus:ring-[#047857] h-4 w-4"
                />
                <label htmlFor="delivery-available" className="text-xs font-medium text-slate-700">
                  Interstate Delivery / Courier Service Available Across Nigeria
                </label>
              </div>
            </div>

            {/* Section 5: Multiple Product Images */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                5. Product Images (Multi-Image Upload) *
              </h4>

              {/* Image Previews */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-100 group">
                    <img 
                      src={img} 
                      alt={`Product preview ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-[#047857] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}

                {/* Upload Trigger */}
                <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-[#047857] flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-emerald-50/40">
                  <Upload className="h-5 w-5 text-slate-400 group-hover:text-emerald-700 mb-1" />
                  <span className="text-[10px] font-medium text-slate-600">Upload Files</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Add Image by URL */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Or paste an image URL..."
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#047857]"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                >
                  Add URL
                </button>
              </div>

              {/* Sample Photo Pickers for Easy Instant Testing */}
              <div className="pt-2">
                <p className="text-[11px] font-medium text-slate-500 mb-2">
                  Or pick from Nigerian fashion photography samples:
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_SAMPLE_PHOTOS.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setImages([...images, preset.url])}
                      className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 border border-slate-200 rounded-full transition-colors"
                    >
                      + {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className="px-6 py-2.5 bg-[#047857] hover:bg-[#065F46] text-white rounded-lg text-xs font-bold shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isEditing ? 'Save Product Changes' : 'Publish Product to Marketplace'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
