<script>
	export let data;
	import { sceneLoaded } from '../stores.js';
	import { onMount } from 'svelte';
	import '../style.css';

	let el;
	sceneLoaded.set(false);

	onMount(async () => {
		sceneLoaded.set(true)
	});
</script>

<div class="main">
	<div class="resume__container">
        <div>
			<h1 class="resume__title">Resume</h1>

			<div class="resume__section__title">
            	<h2 >Education</h2>
				<hr>
			</div>
			<div class="resume__section">
				<div class="resume__item">
					<h2>University of Washington</h2>
					<h3>MS, Computer Science & Software Engineering</h3>
					<h3>June, 2024</h3>
				</div>
				<div class="resume__item">
					<h2>Western Washington University</h2>
					<h3>BS, Computer Science</h3>
					<h3>June, 2021</h3>
				</div>
			</div>
			<br>
			<div class="resume__section__title">
            	<h2 >Experience</h2>
				<hr>
			</div>
			<div class="resume__section">
				<div class="resume__item">
					<h2>Programming Lab Instructor</h2>
					<h3>University of Washington</h3>
					<h3>2022-Present</h3>
					<ul class="resume__list">
						<li>Designed and taught Java and C++ curricula across two classes, each with 45 students, achieving high student satisfaction and positive feedback.</li>
						<li>Created an automated grading system to streamline lab submission organization and compilation which has been adopted by several other instructors.</li>
						<li>Introduced an in-class activity that significantly boosted class attendance from previous quarters.</li>
					</ul>
				</div>
				<div class="resume__item">
					<h2>Software Engineer Intern</h2>
					<h3>HaptX</h3>
					<h3>2022-2023</h3>
					<ul class="resume__list">
						<li>Utilized OpenXR, C#, and C++ to develop and implement compatibility tests between HaptX gloves and different pieces of VR/AR hardware inside of the Unity and Unreal engines.</li>
						<li>Provided proof of compatibility between HaptX gloves and five different headsets and four hand trackers, leading to the largest sale the company had received at the time of my employment.</li>
						<li>Conducted detailed performance analyses of VR trackers against company standards, ensuring high-quality integration and functionality.</li>
						<li>Modeled, 3D printed, and tested tracker mounts for various hand trackers, showcasing the gloves' viability with multiple headsets and controllers.</li>
					</ul>
				</div>
				<div class="resume__item">
					<h2>Unity Developer, Contract</h2>
					<h3>ipureland</h3>
					<h3>2022</h3>
					<ul class="resume__list">
						<li>Collaborated closely with Artistic Director to develop a unique mobile AR experience.</li>
						<li>Used Unity and MRTK to design and optimize an AR app for mobile platforms.</li>
						<li>Successfully deployed the app, leading to its publication to the Apple app store as well as it being showcased at several art festivals across the globe.</li>
					</ul>
				</div>
				<div class="resume__item">
					<h2>User Experience Development Intern</h2>
					<h3>NASDAQ eVestment</h3>
					<h3>2020-2021</h3>
					<ul class="resume__list">
						<li>Developed design tools that streamlined prototype creation, significantly increasing the production of interface prototypes.</li>
						<li>Translated interface designs into React.js assets, facilitating their implementation by the development team and reaching over 10,000 users.</li>
					</ul>
				</div>
			</div>
			<br>
			<div class="resume__section__title">
            	<h2 >Project Experience</h2>
				<hr>
			</div>
			<div class="resume__section">
				<div class="resume__item">
					<h2>Master’s Thesis, Real-Time Physically Based Volumetric Cloud Rendering</h2>
					<h3>University of Washington</h3>
					<h3>2023-2024</h3>
					<ul class="resume__list">
						<li>Developed a cloud rendering system with Unity and HLSL that simulates natural cloud formation, designed to operate in real-time for interactive media.</li>
						<li>Merged techniques from high-detail cloud rendering with real-time rendering systems to improve performance without sacrificing visual quality.</li>
					</ul>
				</div>
			</div>
        </div>
	</div>
	<div class="resume__spacer"></div>
</div>
