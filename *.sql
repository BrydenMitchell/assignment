-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Mar 24, 2021 at 03:53 AM
-- Server version: 5.7.32
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `quiz`
--

-- --------------------------------------------------------

--
-- Table structure for table `answer`
--

CREATE TABLE `answer` (
  `ID` int(255) NOT NULL,
  `questionID` int(255) NOT NULL,
  `text` varchar(255) NOT NULL,
  `isCorrect` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `answer`
--

INSERT INTO `answer` (`ID`, `questionID`, `text`, `isCorrect`) VALUES
(1, 1, 'Q1 A1 F', 0),
(2, 1, 'Q1 A2 F', 0),
(3, 1, 'Q1 A3 T', 1),
(4, 2, 'Q2 A1 T', 1),
(5, 2, 'Q2 A2 F', 0),
(6, 3, 'Q3 A1 F', 0),
(7, 3, 'Q3 A2 F', 0),
(8, 3, 'Q3 A3 T', 1),
(9, 3, 'Q3 A4 F', 0),
(10, 4, 'Q4 A1 F', 0),
(11, 4, 'Q4 A2 T', 1),
(12, 4, 'Q4 A3 F', 0),
(13, 4, 'Q4 A4 F', 0);

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `ID` int(255) NOT NULL,
  `text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`ID`, `text`) VALUES
(1, 'This is a test'),
(2, 'This is also a test'),
(3, 'This is the third Question'),
(4, 'This is the fourth Question');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answer`
--
ALTER TABLE `answer`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK` (`questionID`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answer`
--
ALTER TABLE `answer`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answer`
--
ALTER TABLE `answer`
  ADD CONSTRAINT `FK` FOREIGN KEY (`questionID`) REFERENCES `question` (`ID`);
