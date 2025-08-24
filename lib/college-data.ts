export interface CollegeData {
  name: string
  location: string
  acceptanceRate: number
  avgGPA: number
  avgSAT: number
  avgACT: number
  tuition: number
  type: 'Public' | 'Private' | 'Community College'
  state: string
}

export const colleges: CollegeData[] = [
  // Ivy League
  { name: "Harvard University", location: "Cambridge, MA", acceptanceRate: 4.6, avgGPA: 3.94, avgSAT: 1520, avgACT: 34, tuition: 54768, type: "Private", state: "MA" },
  { name: "Yale University", location: "New Haven, CT", acceptanceRate: 5.9, avgGPA: 3.95, avgSAT: 1515, avgACT: 34, tuition: 59950, type: "Private", state: "CT" },
  { name: "Princeton University", location: "Princeton, NJ", acceptanceRate: 5.6, avgGPA: 3.93, avgSAT: 1515, avgACT: 34, tuition: 57410, type: "Private", state: "NJ" },
  { name: "Columbia University", location: "New York, NY", acceptanceRate: 5.1, avgGPA: 3.91, avgSAT: 1505, avgACT: 34, tuition: 64530, type: "Private", state: "NY" },
  { name: "University of Pennsylvania", location: "Philadelphia, PA", acceptanceRate: 7.4, avgGPA: 3.9, avgSAT: 1500, avgACT: 33, tuition: 61710, type: "Private", state: "PA" },
  { name: "Brown University", location: "Providence, RI", acceptanceRate: 6.9, avgGPA: 3.91, avgSAT: 1505, avgACT: 33, tuition: 62680, type: "Private", state: "RI" },
  { name: "Dartmouth College", location: "Hanover, NH", acceptanceRate: 8.8, avgGPA: 3.9, avgSAT: 1500, avgACT: 33, tuition: 60870, type: "Private", state: "NH" },
  { name: "Cornell University", location: "Ithaca, NY", acceptanceRate: 10.6, avgGPA: 3.9, avgSAT: 1480, avgACT: 33, tuition: 61815, type: "Private", state: "NY" },

  // Top Public Universities
  { name: "University of California, Berkeley", location: "Berkeley, CA", acceptanceRate: 14.5, avgGPA: 3.89, avgSAT: 1415, avgACT: 31, tuition: 14226, type: "Public", state: "CA" },
  { name: "University of California, Los Angeles", location: "Los Angeles, CA", acceptanceRate: 12.3, avgGPA: 3.9, avgSAT: 1405, avgACT: 31, tuition: 13249, type: "Public", state: "CA" },
  { name: "University of Michigan", location: "Ann Arbor, MI", acceptanceRate: 20.2, avgGPA: 3.88, avgSAT: 1435, avgACT: 32, tuition: 16836, type: "Public", state: "MI" },
  { name: "University of Virginia", location: "Charlottesville, VA", acceptanceRate: 20.7, avgGPA: 4.32, avgSAT: 1435, avgACT: 32, tuition: 19785, type: "Public", state: "VA" },
  { name: "University of North Carolina at Chapel Hill", location: "Chapel Hill, NC", acceptanceRate: 19.2, avgGPA: 4.39, avgSAT: 1385, avgACT: 30, tuition: 8997, type: "Public", state: "NC" },
  { name: "University of Texas at Austin", location: "Austin, TX", acceptanceRate: 31.8, avgGPA: 3.83, avgSAT: 1355, avgACT: 29, tuition: 11552, type: "Public", state: "TX" },
  { name: "University of Wisconsin-Madison", location: "Madison, WI", acceptanceRate: 57.2, avgGPA: 3.87, avgSAT: 1335, avgACT: 29, tuition: 10820, type: "Public", state: "WI" },
  { name: "University of Illinois at Urbana-Champaign", location: "Champaign, IL", acceptanceRate: 59.7, avgGPA: 3.83, avgSAT: 1335, avgACT: 29, tuition: 17438, type: "Public", state: "IL" },
  { name: "University of Washington", location: "Seattle, WA", acceptanceRate: 53.5, avgGPA: 3.8, avgSAT: 1340, avgACT: 29, tuition: 12076, type: "Public", state: "WA" },
  { name: "University of Florida", location: "Gainesville, FL", acceptanceRate: 30.1, avgGPA: 4.42, avgSAT: 1330, avgACT: 30, tuition: 6380, type: "Public", state: "FL" },
  { name: "University of Georgia", location: "Athens, GA", acceptanceRate: 42.5, avgGPA: 4.0, avgSAT: 1320, avgACT: 30, tuition: 12202, type: "Public", state: "GA" },

  // Top Private Universities
  { name: "Stanford University", location: "Stanford, CA", acceptanceRate: 4.3, avgGPA: 3.96, avgSAT: 1505, avgACT: 34, tuition: 56169, type: "Private", state: "CA" },
  { name: "MIT", location: "Cambridge, MA", acceptanceRate: 6.7, avgGPA: 3.96, avgSAT: 1520, avgACT: 35, tuition: 53790, type: "Private", state: "MA" },
  { name: "California Institute of Technology", location: "Pasadena, CA", acceptanceRate: 6.4, avgGPA: 3.97, avgSAT: 1545, avgACT: 35, tuition: 56064, type: "Private", state: "CA" },
  { name: "Duke University", location: "Durham, NC", acceptanceRate: 7.7, avgGPA: 3.94, avgSAT: 1520, avgACT: 34, tuition: 60488, type: "Private", state: "NC" },
  { name: "Johns Hopkins University", location: "Baltimore, MD", acceptanceRate: 11.2, avgGPA: 3.93, avgSAT: 1505, avgACT: 33, tuition: 58720, type: "Private", state: "MD" },
  { name: "Northwestern University", location: "Evanston, IL", acceptanceRate: 9.1, avgGPA: 3.92, avgSAT: 1495, avgACT: 33, tuition: 60484, type: "Private", state: "IL" },
  { name: "Vanderbilt University", location: "Nashville, TN", acceptanceRate: 9.6, avgGPA: 3.86, avgSAT: 1480, avgACT: 33, tuition: 56050, type: "Private", state: "TN" },
  { name: "Rice University", location: "Houston, TX", acceptanceRate: 9.5, avgGPA: 3.96, avgSAT: 1505, avgACT: 33, tuition: 52070, type: "Private", state: "TX" },
  { name: "Washington University in St. Louis", location: "St. Louis, MO", acceptanceRate: 13.9, avgGPA: 3.83, avgSAT: 1500, avgACT: 33, tuition: 58100, type: "Private", state: "MO" },
  { name: "University of Notre Dame", location: "Notre Dame, IN", acceptanceRate: 15.1, avgGPA: 3.91, avgSAT: 1475, avgACT: 33, tuition: 58136, type: "Private", state: "IN" },

  // More UC Schools
  { name: "University of California, San Diego", location: "San Diego, CA", acceptanceRate: 23.7, avgGPA: 3.87, avgSAT: 1370, avgACT: 30, tuition: 14648, type: "Public", state: "CA" },
  { name: "University of California, Davis", location: "Davis, CA", acceptanceRate: 46.3, avgGPA: 3.99, avgSAT: 1280, avgACT: 28, tuition: 14402, type: "Public", state: "CA" },
  { name: "University of California, Irvine", location: "Irvine, CA", acceptanceRate: 28.9, avgGPA: 3.96, avgSAT: 1310, avgACT: 29, tuition: 14360, type: "Public", state: "CA" },
  { name: "University of California, Santa Barbara", location: "Santa Barbara, CA", acceptanceRate: 29.2, avgGPA: 4.12, avgSAT: 1335, avgACT: 29, tuition: 14450, type: "Public", state: "CA" },
  { name: "University of California, Santa Cruz", location: "Santa Cruz, CA", acceptanceRate: 51.3, avgGPA: 3.71, avgSAT: 1285, avgACT: 28, tuition: 14360, type: "Public", state: "CA" },
  { name: "University of California, Riverside", location: "Riverside, CA", acceptanceRate: 65.5, avgGPA: 3.69, avgSAT: 1230, avgACT: 26, tuition: 14360, type: "Public", state: "CA" },
  { name: "University of California, Merced", location: "Merced, CA", acceptanceRate: 87.3, avgGPA: 3.46, avgSAT: 1080, avgACT: 22, tuition: 14360, type: "Public", state: "CA" },

  // California State Universities
  { name: "Cal Poly San Luis Obispo", location: "San Luis Obispo, CA", acceptanceRate: 28.4, avgGPA: 3.85, avgSAT: 1350, avgACT: 29, tuition: 10037, type: "Public", state: "CA" },
  { name: "San Diego State University", location: "San Diego, CA", acceptanceRate: 34.1, avgGPA: 3.7, avgSAT: 1200, avgACT: 25, tuition: 8084, type: "Public", state: "CA" },
  { name: "Cal Poly Pomona", location: "Pomona, CA", acceptanceRate: 55.2, avgGPA: 3.54, avgSAT: 1140, avgACT: 23, tuition: 8084, type: "Public", state: "CA" },
  { name: "San Jose State University", location: "San Jose, CA", acceptanceRate: 67.1, avgGPA: 3.4, avgSAT: 1100, avgACT: 22, tuition: 8084, type: "Public", state: "CA" },
  { name: "California State University, Long Beach", location: "Long Beach, CA", acceptanceRate: 39.5, avgGPA: 3.56, avgSAT: 1130, avgACT: 23, tuition: 8084, type: "Public", state: "CA" },
  { name: "California State University, Fullerton", location: "Fullerton, CA", acceptanceRate: 53.7, avgGPA: 3.5, avgSAT: 1110, avgACT: 22, tuition: 8084, type: "Public", state: "CA" },

  // More Top Public Universities
  { name: "University of Maryland", location: "College Park, MD", acceptanceRate: 44.2, avgGPA: 4.28, avgSAT: 1375, avgACT: 31, tuition: 10879, type: "Public", state: "MD" },
  { name: "University of Pittsburgh", location: "Pittsburgh, PA", acceptanceRate: 56.7, avgGPA: 3.59, avgSAT: 1310, avgACT: 29, tuition: 19358, type: "Public", state: "PA" },
  { name: "Rutgers University", location: "New Brunswick, NJ", acceptanceRate: 60.1, avgGPA: 3.73, avgSAT: 1300, avgACT: 28, tuition: 15192, type: "Public", state: "NJ" },
  { name: "University of Minnesota", location: "Minneapolis, MN", acceptanceRate: 56.7, avgGPA: 3.71, avgSAT: 1305, avgACT: 28, tuition: 15358, type: "Public", state: "MN" },
  { name: "University of Iowa", location: "Iowa City, IA", acceptanceRate: 82.5, avgGPA: 3.76, avgSAT: 1230, avgACT: 25, tuition: 9873, type: "Public", state: "IA" },
  { name: "University of Arizona", location: "Tucson, AZ", acceptanceRate: 84.6, avgGPA: 3.39, avgSAT: 1230, avgACT: 25, tuition: 12300, type: "Public", state: "AZ" },
  { name: "Arizona State University", location: "Tempe, AZ", acceptanceRate: 88.2, avgGPA: 3.42, avgSAT: 1210, avgACT: 25, tuition: 11318, type: "Public", state: "AZ" },
  { name: "University of Colorado Boulder", location: "Boulder, CO", acceptanceRate: 78.9, avgGPA: 3.66, avgSAT: 1250, avgACT: 27, tuition: 12880, type: "Public", state: "CO" },
  { name: "University of Oregon", location: "Eugene, OR", acceptanceRate: 83.4, avgGPA: 3.59, avgSAT: 1200, avgACT: 25, tuition: 12320, type: "Public", state: "OR" },
  { name: "University of Utah", location: "Salt Lake City, UT", acceptanceRate: 79.4, avgGPA: 3.66, avgSAT: 1220, avgACT: 25, tuition: 8762, type: "Public", state: "UT" },

  // More Top Private Universities
  { name: "Georgetown University", location: "Washington, DC", acceptanceRate: 14.5, avgGPA: 3.89, avgSAT: 1450, avgACT: 32, tuition: 59784, type: "Private", state: "DC" },
  { name: "Carnegie Mellon University", location: "Pittsburgh, PA", acceptanceRate: 15.4, avgGPA: 3.84, avgSAT: 1460, avgACT: 33, tuition: 58030, type: "Private", state: "PA" },
  { name: "University of Southern California", location: "Los Angeles, CA", acceptanceRate: 12.5, avgGPA: 3.79, avgSAT: 1440, avgACT: 32, tuition: 61892, type: "Private", state: "CA" },
  { name: "New York University", location: "New York, NY", acceptanceRate: 12.8, avgGPA: 3.69, avgSAT: 1440, avgACT: 32, tuition: 56500, type: "Private", state: "NY" },
  { name: "Boston University", location: "Boston, MA", acceptanceRate: 18.3, avgGPA: 3.71, avgSAT: 1420, avgACT: 32, tuition: 58656, type: "Private", state: "MA" },
  { name: "Tufts University", location: "Medford, MA", acceptanceRate: 15.0, avgGPA: 3.91, avgSAT: 1465, avgACT: 33, tuition: 61804, type: "Private", state: "MA" },
  { name: "Wake Forest University", location: "Winston-Salem, NC", acceptanceRate: 29.4, avgGPA: 3.9, avgSAT: 1365, avgACT: 30, tuition: 59124, type: "Private", state: "NC" },
  { name: "Emory University", location: "Atlanta, GA", acceptanceRate: 15.6, avgGPA: 3.78, avgSAT: 1435, avgACT: 32, tuition: 54800, type: "Private", state: "GA" },
  { name: "Tulane University", location: "New Orleans, LA", acceptanceRate: 11.1, avgGPA: 3.56, avgSAT: 1410, avgACT: 31, tuition: 58752, type: "Private", state: "LA" },
  { name: "Brandeis University", location: "Waltham, MA", acceptanceRate: 39.1, avgGPA: 3.83, avgSAT: 1375, avgACT: 30, tuition: 59818, type: "Private", state: "MA" },

  // Liberal Arts Colleges
  { name: "Williams College", location: "Williamstown, MA", acceptanceRate: 12.6, avgGPA: 3.9, avgSAT: 1480, avgACT: 33, tuition: 59950, type: "Private", state: "MA" },
  { name: "Amherst College", location: "Amherst, MA", acceptanceRate: 11.3, avgGPA: 3.9, avgSAT: 1480, avgACT: 33, tuition: 59950, type: "Private", state: "MA" },
  { name: "Swarthmore College", location: "Swarthmore, PA", acceptanceRate: 8.9, avgGPA: 3.9, avgSAT: 1470, avgACT: 33, tuition: 56424, type: "Private", state: "PA" },
  { name: "Pomona College", location: "Claremont, CA", acceptanceRate: 6.6, avgGPA: 3.9, avgSAT: 1470, avgACT: 33, tuition: 56478, type: "Private", state: "CA" },
  { name: "Wellesley College", location: "Wellesley, MA", acceptanceRate: 16.2, avgGPA: 3.9, avgSAT: 1450, avgACT: 32, tuition: 59920, type: "Private", state: "MA" },
  { name: "Bowdoin College", location: "Brunswick, ME", acceptanceRate: 9.1, avgGPA: 3.9, avgSAT: 1460, avgACT: 33, tuition: 58704, type: "Private", state: "ME" },
  { name: "Carleton College", location: "Northfield, MN", acceptanceRate: 18.2, avgGPA: 3.9, avgSAT: 1430, avgACT: 32, tuition: 58744, type: "Private", state: "MN" },
  { name: "Middlebury College", location: "Middlebury, VT", acceptanceRate: 15.7, avgGPA: 3.9, avgSAT: 1430, avgACT: 32, tuition: 59802, type: "Private", state: "VT" },
  { name: "Claremont McKenna College", location: "Claremont, CA", acceptanceRate: 10.3, avgGPA: 3.9, avgSAT: 1450, avgACT: 32, tuition: 56478, type: "Private", state: "CA" },
  { name: "Davidson College", location: "Davidson, NC", acceptanceRate: 18.2, avgGPA: 3.9, avgSAT: 1380, avgACT: 31, tuition: 54808, type: "Private", state: "NC" },

  // More State Universities
  { name: "University of Alabama", location: "Tuscaloosa, AL", acceptanceRate: 80.1, avgGPA: 3.71, avgSAT: 1180, avgACT: 25, tuition: 11200, type: "Public", state: "AL" },
  { name: "Auburn University", location: "Auburn, AL", acceptanceRate: 71.1, avgGPA: 3.74, avgSAT: 1200, avgACT: 25, tuition: 11200, type: "Public", state: "AL" },
  { name: "University of Arkansas", location: "Fayetteville, AR", acceptanceRate: 77.1, avgGPA: 3.72, avgSAT: 1190, avgACT: 25, tuition: 9800, type: "Public", state: "AR" },
  { name: "University of Delaware", location: "Newark, DE", acceptanceRate: 66.4, avgGPA: 3.77, avgSAT: 1240, avgACT: 27, tuition: 14280, type: "Public", state: "DE" },
  { name: "University of Kentucky", location: "Lexington, KY", acceptanceRate: 94.6, avgGPA: 3.51, avgSAT: 1160, avgACT: 24, tuition: 12720, type: "Public", state: "KY" },
  { name: "University of Louisville", location: "Louisville, KY", acceptanceRate: 69.9, avgGPA: 3.5, avgSAT: 1150, avgACT: 24, tuition: 12720, type: "Public", state: "KY" },
  { name: "Louisiana State University", location: "Baton Rouge, LA", acceptanceRate: 70.5, avgGPA: 3.4, avgSAT: 1140, avgACT: 24, tuition: 11200, type: "Public", state: "LA" },
  { name: "University of Mississippi", location: "Oxford, MS", acceptanceRate: 88.1, avgGPA: 3.42, avgSAT: 1130, avgACT: 23, tuition: 8800, type: "Public", state: "MS" },
  { name: "Mississippi State University", location: "Starkville, MS", acceptanceRate: 80.2, avgGPA: 3.4, avgSAT: 1120, avgACT: 23, tuition: 8800, type: "Public", state: "MS" },
  { name: "University of Missouri", location: "Columbia, MO", acceptanceRate: 81.8, avgGPA: 3.52, avgSAT: 1200, avgACT: 25, tuition: 10800, type: "Public", state: "MO" },

  // More Private Universities
  { name: "Baylor University", location: "Waco, TX", acceptanceRate: 45.3, avgGPA: 3.72, avgSAT: 1270, avgACT: 27, tuition: 50448, type: "Private", state: "TX" },
  { name: "Southern Methodist University", location: "Dallas, TX", acceptanceRate: 47.3, avgGPA: 3.64, avgSAT: 1340, avgACT: 30, tuition: 58000, type: "Private", state: "TX" },
  { name: "Texas Christian University", location: "Fort Worth, TX", acceptanceRate: 47.1, avgGPA: 3.64, avgSAT: 1240, avgACT: 27, tuition: 51560, type: "Private", state: "TX" },
  { name: "University of Miami", location: "Coral Gables, FL", acceptanceRate: 27.9, avgGPA: 3.6, avgSAT: 1330, avgACT: 30, tuition: 54800, type: "Private", state: "FL" },
  { name: "Florida State University", location: "Tallahassee, FL", acceptanceRate: 32.5, avgGPA: 4.07, avgSAT: 1270, avgACT: 28, tuition: 6380, type: "Public", state: "FL" },
  { name: "University of Central Florida", location: "Orlando, FL", acceptanceRate: 44.4, avgGPA: 4.12, avgSAT: 1270, avgACT: 27, tuition: 6380, type: "Public", state: "FL" },
  { name: "Georgia Institute of Technology", location: "Atlanta, GA", acceptanceRate: 21.3, avgGPA: 4.07, avgSAT: 1435, avgACT: 32, tuition: 12068, type: "Public", state: "GA" },
  { name: "Georgia State University", location: "Atlanta, GA", acceptanceRate: 67.2, avgGPA: 3.4, avgSAT: 1110, avgACT: 22, tuition: 12202, type: "Public", state: "GA" },
  { name: "Kennesaw State University", location: "Kennesaw, GA", acceptanceRate: 82.8, avgGPA: 3.2, avgSAT: 1080, avgACT: 21, tuition: 12202, type: "Public", state: "GA" },
  { name: "University of Hawaii at Manoa", location: "Honolulu, HI", acceptanceRate: 58.4, avgGPA: 3.5, avgSAT: 1170, avgACT: 24, tuition: 12000, type: "Public", state: "HI" },

  // More Universities
  { name: "Boise State University", location: "Boise, ID", acceptanceRate: 81.0, avgGPA: 3.4, avgSAT: 1100, avgACT: 22, tuition: 8000, type: "Public", state: "ID" },
  { name: "University of Idaho", location: "Moscow, ID", acceptanceRate: 74.5, avgGPA: 3.3, avgSAT: 1080, avgACT: 22, tuition: 8000, type: "Public", state: "ID" },
  { name: "Illinois State University", location: "Normal, IL", acceptanceRate: 89.1, avgGPA: 3.4, avgSAT: 1100, avgACT: 22, tuition: 15000, type: "Public", state: "IL" },
  { name: "Northern Illinois University", location: "DeKalb, IL", acceptanceRate: 48.7, avgGPA: 3.2, avgSAT: 1050, avgACT: 21, tuition: 15000, type: "Public", state: "IL" },
  { name: "Indiana University", location: "Bloomington, IN", acceptanceRate: 78.4, avgGPA: 3.72, avgSAT: 1240, avgACT: 27, tuition: 11000, type: "Public", state: "IN" },
  { name: "Purdue University", location: "West Lafayette, IN", acceptanceRate: 60.4, avgGPA: 3.69, avgSAT: 1310, avgACT: 29, tuition: 11000, type: "Public", state: "IN" },
  { name: "Iowa State University", location: "Ames, IA", acceptanceRate: 92.3, avgGPA: 3.6, avgSAT: 1200, avgACT: 25, tuition: 9000, type: "Public", state: "IA" },
  { name: "Kansas State University", location: "Manhattan, KS", acceptanceRate: 95.7, avgGPA: 3.5, avgSAT: 1150, avgACT: 23, tuition: 10000, type: "Public", state: "KS" },
  { name: "University of Kansas", location: "Lawrence, KS", acceptanceRate: 92.5, avgGPA: 3.6, avgSAT: 1200, avgACT: 25, tuition: 10000, type: "Public", state: "KS" },
  { name: "University of Kentucky", location: "Lexington, KY", acceptanceRate: 94.6, avgGPA: 3.51, avgSAT: 1160, avgACT: 24, tuition: 12720, type: "Public", state: "KY" },

  // Community Colleges (Top 20)
  { name: "Santa Monica College", location: "Santa Monica, CA", acceptanceRate: 100, avgGPA: 3.0, avgSAT: 1000, avgACT: 20, tuition: 1200, type: "Community College", state: "CA" },
  { name: "De Anza College", location: "Cupertino, CA", acceptanceRate: 100, avgGPA: 3.0, avgSAT: 1000, avgACT: 20, tuition: 1200, type: "Community College", state: "CA" },
  { name: "Pasadena City College", location: "Pasadena, CA", acceptanceRate: 100, avgGPA: 3.0, avgSAT: 1000, avgACT: 20, tuition: 1200, type: "Community College", state: "CA" },
  { name: "Orange Coast College", location: "Costa Mesa, CA", acceptanceRate: 100, avgGPA: 3.0, avgSAT: 1000, avgACT: 20, tuition: 1200, type: "Community College", state: "CA" },
  { name: "Foothill College", location: "Los Altos Hills, CA", acceptanceRate: 100, avgGPA: 3.0, avgSAT: 1000, avgACT: 20, tuition: 1200, type: "Community College", state: "CA" },
  { name: "Miami Dade College", location: "Miami, FL", acceptanceRate: 100, avgGPA: 3.0, avgSAT: 1000, avgACT: 20, tuition: 2500, type: "Community College", state: "FL" },
  { name: "Broward College", location: "Fort Lauderdale, FL", acceptanceRate: 100, avgGPA: 3.0, avgSAT: 1000, avgACT: 20, tuition: 2500, type: "Community College", state: "FL" },
  { name: "Valencia College", location: "Orlando, FL", acceptanceRate: 100, avgGPA: 3.0, avgSAT: 1000, avgACT: 20, tuition: 2500, type: "Community College", state: "FL" },
  { name: "Houston Community College", location: "Houston, TX", acceptanceRate: 100, avgGPA: 3.0, avgSAT: 1000, avgACT: 20, tuition: 2000, type: "Community College", state: "TX" },
  { name: "Austin Community College", location: "Austin, TX", acceptanceRate: 100, avgGPA: 3.0, avgSAT: 1000, avgACT: 20, tuition: 2000, type: "Community College", state: "TX" },

  // More Universities by State
  { name: "University of Nevada, Las Vegas", location: "Las Vegas, NV", acceptanceRate: 81.2, avgGPA: 3.3, avgSAT: 1130, avgACT: 22, tuition: 8000, type: "Public", state: "NV" },
  { name: "University of Nevada, Reno", location: "Reno, NV", acceptanceRate: 88.2, avgGPA: 3.4, avgSAT: 1150, avgACT: 23, tuition: 8000, type: "Public", state: "NV" },
  { name: "University of New Hampshire", location: "Durham, NH", acceptanceRate: 84.2, avgGPA: 3.5, avgSAT: 1200, avgACT: 26, tuition: 18000, type: "Public", state: "NH" },
  { name: "Rutgers University-Newark", location: "Newark, NJ", acceptanceRate: 72.1, avgGPA: 3.4, avgSAT: 1180, avgACT: 24, tuition: 15000, type: "Public", state: "NJ" },
  { name: "New Mexico State University", location: "Las Cruces, NM", acceptanceRate: 55.4, avgGPA: 3.2, avgSAT: 1050, avgACT: 20, tuition: 7000, type: "Public", state: "NM" },
  { name: "University of New Mexico", location: "Albuquerque, NM", acceptanceRate: 96.9, avgGPA: 3.3, avgSAT: 1100, avgACT: 21, tuition: 7000, type: "Public", state: "NM" },
  { name: "SUNY Binghamton", location: "Binghamton, NY", acceptanceRate: 41.4, avgGPA: 3.8, avgSAT: 1340, avgACT: 30, tuition: 10000, type: "Public", state: "NY" },
  { name: "SUNY Buffalo", location: "Buffalo, NY", acceptanceRate: 67.7, avgGPA: 3.6, avgSAT: 1250, avgACT: 27, tuition: 10000, type: "Public", state: "NY" },
  { name: "SUNY Stony Brook", location: "Stony Brook, NY", acceptanceRate: 44.2, avgGPA: 3.8, avgSAT: 1330, avgACT: 29, tuition: 10000, type: "Public", state: "NY" },
  { name: "Ohio State University", location: "Columbus, OH", acceptanceRate: 53.7, avgGPA: 3.76, avgSAT: 1310, avgACT: 28, tuition: 12000, type: "Public", state: "OH" },

  // Continue with more universities...
  { name: "University of Cincinnati", location: "Cincinnati, OH", acceptanceRate: 76.4, avgGPA: 3.5, avgSAT: 1200, avgACT: 25, tuition: 12000, type: "Public", state: "OH" },
  { name: "Miami University", location: "Oxford, OH", acceptanceRate: 88.6, avgGPA: 3.6, avgSAT: 1240, avgACT: 27, tuition: 15000, type: "Public", state: "OH" },
  { name: "University of Oklahoma", location: "Norman, OK", acceptanceRate: 80.4, avgGPA: 3.6, avgSAT: 1200, avgACT: 25, tuition: 9000, type: "Public", state: "OK" },
  { name: "Oklahoma State University", location: "Stillwater, OK", acceptanceRate: 67.4, avgGPA: 3.5, avgSAT: 1150, avgACT: 23, tuition: 9000, type: "Public", state: "OK" },
  { name: "University of Oregon", location: "Eugene, OR", acceptanceRate: 83.4, avgGPA: 3.59, avgSAT: 1200, avgACT: 25, tuition: 12320, type: "Public", state: "OR" },
  { name: "Oregon State University", location: "Corvallis, OR", acceptanceRate: 82.2, avgGPA: 3.5, avgSAT: 1180, avgACT: 24, tuition: 12000, type: "Public", state: "OR" },
  { name: "Penn State University", location: "University Park, PA", acceptanceRate: 50.1, avgGPA: 3.59, avgSAT: 1270, avgACT: 28, tuition: 18000, type: "Public", state: "PA" },
  { name: "Temple University", location: "Philadelphia, PA", acceptanceRate: 60.0, avgGPA: 3.4, avgSAT: 1150, avgACT: 24, tuition: 17000, type: "Public", state: "PA" },
  { name: "University of Rhode Island", location: "Kingston, RI", acceptanceRate: 75.4, avgGPA: 3.4, avgSAT: 1150, avgACT: 24, tuition: 15000, type: "Public", state: "RI" },
  { name: "Clemson University", location: "Clemson, SC", acceptanceRate: 51.3, avgGPA: 4.0, avgSAT: 1310, avgACT: 29, tuition: 15000, type: "Public", state: "SC" },

  // Final batch
  { name: "University of South Carolina", location: "Columbia, SC", acceptanceRate: 68.6, avgGPA: 4.0, avgSAT: 1240, avgACT: 27, tuition: 12000, type: "Public", state: "SC" },
  { name: "University of Tennessee", location: "Knoxville, TN", acceptanceRate: 78.8, avgGPA: 3.8, avgSAT: 1220, avgACT: 26, tuition: 13000, type: "Public", state: "TN" },
  { name: "University of Memphis", location: "Memphis, TN", acceptanceRate: 84.9, avgGPA: 3.4, avgSAT: 1100, avgACT: 22, tuition: 10000, type: "Public", state: "TN" },
  { name: "University of Houston", location: "Houston, TX", acceptanceRate: 65.4, avgGPA: 3.4, avgSAT: 1160, avgACT: 23, tuition: 11000, type: "Public", state: "TX" },
  { name: "Texas A&M University", location: "College Station, TX", acceptanceRate: 63.3, avgGPA: 3.68, avgSAT: 1270, avgACT: 28, tuition: 12000, type: "Public", state: "TX" },
  { name: "University of Utah", location: "Salt Lake City, UT", acceptanceRate: 79.4, avgGPA: 3.66, avgSAT: 1220, avgACT: 25, tuition: 8762, type: "Public", state: "UT" },
  { name: "Utah State University", location: "Logan, UT", acceptanceRate: 91.1, avgGPA: 3.5, avgSAT: 1150, avgACT: 23, tuition: 8000, type: "Public", state: "UT" },
  { name: "University of Vermont", location: "Burlington, VT", acceptanceRate: 67.3, avgGPA: 3.7, avgSAT: 1250, avgACT: 27, tuition: 18000, type: "Public", state: "VT" },
  { name: "Virginia Tech", location: "Blacksburg, VA", acceptanceRate: 66.0, avgGPA: 4.0, avgSAT: 1280, avgACT: 28, tuition: 14000, type: "Public", state: "VA" },
  { name: "Virginia Commonwealth University", location: "Richmond, VA", acceptanceRate: 87.2, avgGPA: 3.6, avgSAT: 1150, avgACT: 24, tuition: 15000, type: "Public", state: "VA" }
]
