import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import LandHero from "../../components/Land/LandHero/LandHero";
import LandCategories from "../../components/Land/LandCategories/LandCategories";
import FeaturedLand from "../../components/Land/FeaturedLand/FeaturedLand";
import InvestBenefits from "../../components/Land/InvestBenefits/InvestBenefits";
import LandGuide from "../../components/Land/LandGuide/LandGuide";
import LandNewsletterModal from "../../components/Land/LandNewsletterModal/LandNewsletterModal";
import LandEnquiryForm from "../../components/Land/LandEnquiryForm/LandEnquiryForm";
import LandCTA from "../../components/Land/LandCTA/LandCTA";
import LandCard from "../../components/Land/LandCard/LandCard";
import { publicPropertyAPI } from "../../../../services/adminApi";
import "./LandPage.css";

const LandPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [lands, setLands] = useState([]);
  const [featuredLands, setFeaturedLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  // Create a ref for the lands grid section
  const landsGridRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-in-out",
    });

    loadFeaturedLands();

    // Check modal dismissal and subscription status
    const modalDismissed = localStorage.getItem("landModalDismissed");
    const subscribed = localStorage.getItem("landGuideSubscribed");
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const isDismissedRecently =
      modalDismissed && Date.now() - parseInt(modalDismissed) < sevenDays;

    if (subscribed) {
      setHasSubscribed(true);
    }

    // Show modal after 30 seconds if not subscribed and not recently dismissed
    const timer = setTimeout(() => {
      if (!subscribed && !isDismissedRecently) {
        setShowModal(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  // Reload lands when currentPage, priceRange, or searchTerm changes
  useEffect(() => {
    loadLands();
  }, [currentPage, priceRange, searchTerm]);

  // Function to scroll to lands grid
  const scrollToLandsGrid = () => {
    if (landsGridRef.current) {
      const yOffset = -80;
      const element = landsGridRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  const loadLands = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      // Add search term to API call
      if (searchTerm && searchTerm.trim() !== "") {
        params.search = searchTerm;
      }

      // Add price filter
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-");
        if (max) {
          params.minPrice = min;
          params.maxPrice = max;
        } else if (priceRange === "250000000+") {
          params.minPrice = 250000000;
        } else if (priceRange === "100000000-250000000") {
          params.minPrice = 100000000;
          params.maxPrice = 250000000;
        }
      }

      const response = await publicPropertyAPI.getPropertiesByType(
        "land",
        params,
      );

      setLands(response.data || []);
      setTotalPages(
        Math.ceil((response.pagination?.total || 0) / itemsPerPage),
      );

      // Scroll to lands grid after search or filter
      if (searchTerm || priceRange !== "all") {
        setTimeout(() => {
          scrollToLandsGrid();
        }, 100);
      }
    } catch (error) {
      console.error("Failed to load lands:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedLands = async () => {
    try {
      setFeaturedLoading(true);
      const response = await publicPropertyAPI.getFeaturedProperties();
      const featured =
        response.data?.filter((property) => property.type === "land") || [];
      setFeaturedLands(featured.slice(0, 3));
    } catch (error) {
      console.error("Failed to load featured lands:", error);
    } finally {
      setFeaturedLoading(false);
    }
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const handlePriceFilter = (range) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  const handleSubscribe = async (email) => {
    try {
      const response = await fetch("http://localhost:5000/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, preferences: ["land_guide"] }),
      });

      if (response.ok) {
        localStorage.setItem("landGuideSubscribed", "true");
        localStorage.setItem("subscriberEmail", email);
        setHasSubscribed(true);
        setShowModal(false);
        alert(
          "Thank you for subscribing! Check your email for the land guide.",
        );
      } else {
        alert("Subscription failed. Please try again.");
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Subscription failed. Please check your connection.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem("landModalDismissed", Date.now().toString());
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange("all");
    setCurrentPage(1);
  };

  return (
    <div className="land-page">
      <LandHero
        onSearch={handleSearch}
        onPriceFilter={handlePriceFilter}
        selectedPrice={priceRange}
      />
      <LandCategories />

      <FeaturedLand featuredLands={featuredLands} loading={featuredLoading} />

      <InvestBenefits />

      {/* All Lands Grid Section */}
      <section ref={landsGridRef} className="lands-grid-section">
        <div className="container">
          <div className="section-header">
            <h2>Available Lands for Investment</h2>
            <p>
              Choose from our curated selection of premium lands across Nigeria
            </p>
          </div>

          {/* Search Results Info Bar */}
          {(searchTerm || priceRange !== "all") && !loading && (
            <div className="search-results-info">
              <p>
                <span className="search-results-count">
                  Found
                  <span className="search-results-number">{lands.length}</span>
                  land{lands.length !== 1 ? "s" : ""}
                  {searchTerm && (
                    <span className="search-results-term">{searchTerm}</span>
                  )}
                </span>
                {priceRange !== "all" && (
                  <span className="filter-badge price">
                    {priceRange === "0-10000000" && "Under ₦10M"}
                    {priceRange === "10000000-50000000" && "₦10M - ₦50M"}
                    {priceRange === "50000000-100000000" && "₦50M - ₦100M"}
                    {priceRange === "100000000-250000000" && "₦100M - ₦250M"}
                    {priceRange === "250000000+" && "₦250M+"}
                  </span>
                )}
              </p>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading lands...</p>
            </div>
          ) : lands.length > 0 ? (
            <>
              <div className="lands-grid">
                {lands.map((land, index) => (
                  <LandCard key={land._id} land={land} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <p>No lands found matching your criteria.</p>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </div>
      </section>

      <LandGuide />
      <LandEnquiryForm />
      <LandCTA />

      <LandNewsletterModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
};

export default LandPage;
